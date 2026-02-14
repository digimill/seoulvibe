import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const LANGS = ["ko", "en", "ja", "zh-cn", "zh-tw", "zh-hk"];
const OUT_DIR = path.join(ROOT, "public", "images", "spots");
const OUT_JSON = path.join(ROOT, "data", "spot-images.json");

function hash(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

function escapeXml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function toLines(name) {
  const words = name.split(" ");
  if (words.length <= 1) return [name];

  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > 18 && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
    if (lines.length === 2) break;
  }
  if (current && lines.length < 3) lines.push(current);
  if (lines.length === 0) lines.push(name);
  return lines.slice(0, 3);
}

function buildSvg(name, colorA, colorB) {
  const lines = toLines(name);
  const yStart = 160 - (lines.length - 1) * 26;
  const textNodes = lines
    .map(
      (line, idx) =>
        `<text x="44" y="${yStart + idx * 52}" font-size="36" font-family="Pretendard, Apple SD Gothic Neo, Noto Sans KR, sans-serif" font-weight="700" fill="white">${escapeXml(
          line,
        )}</text>`,
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colorA}" />
      <stop offset="100%" stop-color="${colorB}" />
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#bg)" />
  <circle cx="980" cy="140" r="220" fill="rgba(255,255,255,0.08)" />
  <circle cx="220" cy="760" r="280" fill="rgba(255,255,255,0.07)" />
  <text x="44" y="90" font-size="24" font-family="Pretendard, Apple SD Gothic Neo, Noto Sans KR, sans-serif" font-weight="500" fill="rgba(255,255,255,0.92)">Seoul Vibe Spot</text>
  ${textNodes}
</svg>`;
}

function collectSpots() {
  const names = new Set();
  for (const lang of LANGS) {
    const p = path.join(ROOT, "data", lang, "content.json");
    const content = JSON.parse(readFileSync(p, "utf8"));
    const groups = [...(content.areas ?? []), ...(content.themes ?? []), ...(content.tips ?? [])];
    for (const item of groups) {
      if (item.status && item.status !== "published") continue;
      for (const spot of item.real_spots ?? []) {
        names.add(typeof spot === "string" ? spot : spot.name);
      }
    }
  }
  return [...names];
}

mkdirSync(OUT_DIR, { recursive: true });
rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const palette = [
  ["#0f172a", "#1e40af"],
  ["#1f2937", "#0f766e"],
  ["#312e81", "#9a3412"],
  ["#111827", "#7c2d12"],
  ["#0b3b2e", "#1d4ed8"],
  ["#172554", "#9f1239"],
];

const mapping = {};
const spots = collectSpots();
for (const name of spots) {
  const h = hash(name);
  const idx = parseInt(h.slice(-2), 16) % palette.length;
  const [a, b] = palette[idx];
  const filename = `spot-${h}.svg`;
  const filePath = path.join(OUT_DIR, filename);
  writeFileSync(filePath, buildSvg(name, a, b), "utf8");
  mapping[name] = `/images/spots/${filename}`;
}

writeFileSync(OUT_JSON, JSON.stringify(mapping, null, 2) + "\n");
console.log(`generated spots: ${spots.length}`);
