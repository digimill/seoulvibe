import { readFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const PUBLIC_DIR = path.join(ROOT, "public");
const MIN_WIDTH = 1400;
const MIN_HEIGHT = 900;

let hasError = false;

function getImageSize(absPath) {
  try {
    const out = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", absPath], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const widthMatch = out.match(/pixelWidth:\s+(\d+)/);
    const heightMatch = out.match(/pixelHeight:\s+(\d+)/);
    if (!widthMatch || !heightMatch) return null;
    return {
      width: Number(widthMatch[1]),
      height: Number(heightMatch[1]),
    };
  } catch {
    return null;
  }
}

function auditLangContent(lang) {
  const contentPath = path.join(DATA_DIR, lang, "content.json");
  if (!existsSync(contentPath)) return;

  const content = JSON.parse(readFileSync(contentPath, "utf8"));
  const sections = ["areas", "themes", "tips"];
  const srcCount = new Map();

  for (const section of sections) {
    const list = Array.isArray(content[section]) ? content[section] : [];
    for (const item of list) {
      if (item.status && item.status !== "published") continue;
      const src = item?.image?.src;
      if (!src) {
        console.error(`[${lang}] Missing image src: ${section}/${item.id}`);
        hasError = true;
        continue;
      }

      srcCount.set(src, (srcCount.get(src) || 0) + 1);

      const absPath = path.join(PUBLIC_DIR, src.replace(/^\//, ""));
      if (!existsSync(absPath)) {
        console.error(`[${lang}] Missing file: ${src} (${section}/${item.id})`);
        hasError = true;
        continue;
      }

      if (src.endsWith(".jpg") || src.endsWith(".jpeg") || src.endsWith(".png") || src.endsWith(".webp")) {
        const size = getImageSize(absPath);
        if (size && (size.width < MIN_WIDTH || size.height < MIN_HEIGHT)) {
          console.error(
            `[${lang}] Low resolution: ${src} is ${size.width}x${size.height} (< ${MIN_WIDTH}x${MIN_HEIGHT})`,
          );
          hasError = true;
        }
      }
    }
  }

  for (const [src, count] of srcCount.entries()) {
    if (count > 1) {
      console.error(`[${lang}] Duplicate image source used ${count} times: ${src}`);
      hasError = true;
    }
  }
}

for (const lang of readdirSync(DATA_DIR)) {
  auditLangContent(lang);
}

if (hasError) {
  process.exit(1);
}

console.log("Image audit passed: no duplicates, no missing files, and no low-resolution published images.");
