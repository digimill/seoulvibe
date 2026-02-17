#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const REQUIRED_BRANCHES = ['lang === "ja"', 'lang === "zh-cn"'];
const REQUIRED_TW_HK = 'lang === "zh-tw" || lang === "zh-hk"';

const targets = [
  "app/[lang]/now/page.tsx",
  "app/[lang]/now/subway-help/page.tsx",
  "app/[lang]/now/spend-log/page.tsx",
  "app/[lang]/plan/airport-to-city/page.tsx",
  "app/[lang]/plan/daily-budget/page.tsx",
  "app/[lang]/plan/olive-young/page.tsx",
  "components/NowSubwayDirectionDecoder.tsx",
  "components/OliveYoungBudgetBuilder.tsx",
];

const bannedLiterals = [
  "Open subway guide",
  "T-money quick check",
  "Crowd escape",
];

const errors = [];

for (const rel of targets) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    errors.push(`[missing] ${rel}`);
    continue;
  }
  const text = fs.readFileSync(abs, "utf8");

  for (const token of REQUIRED_BRANCHES) {
    if (!text.includes(token)) {
      errors.push(`[branch] ${rel} is missing locale branch token: ${token}`);
    }
  }
  if (!text.includes(REQUIRED_TW_HK)) {
    errors.push(`[branch] ${rel} is missing locale branch token: ${REQUIRED_TW_HK}`);
  }
}

// Strictly block regressions of known hardcoded CTA literals in non-dictionary JSX.
const subwayPage = fs.readFileSync(path.join(root, "app/[lang]/now/subway-help/page.tsx"), "utf8");
for (const literal of bannedLiterals) {
  if (subwayPage.includes(`>${literal}<`)) {
    errors.push(`[literal] app/[lang]/now/subway-help/page.tsx contains hardcoded English CTA: "${literal}"`);
  }
}

if (errors.length > 0) {
  console.error("i18n smoke check failed:");
  for (const msg of errors) console.error(`- ${msg}`);
  process.exit(1);
}

console.log("i18n smoke check passed.");
