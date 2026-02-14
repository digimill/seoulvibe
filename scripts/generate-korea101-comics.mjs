import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const scenes = [
  { id: "01", title: "지하철 입문", subtitle: "색깔 + 종점만 보면 길이 보인다", left: "여행자", right: "로컬", bg1: "#eff6ff", bg2: "#dbeafe", accent: "#2563eb", icon: "SUBWAY" },
  { id: "02", title: "결제의 현실", subtitle: "카드 중심, 백업은 필수", left: "카드 오류", right: "현금 OK", bg1: "#ecfeff", bg2: "#cffafe", accent: "#0891b2", icon: "CARD" },
  { id: "03", title: "식당 리듬", subtitle: "호출벨과 빠른 주문이 기본", left: "기다림", right: "벨 호출", bg1: "#fef9c3", bg2: "#fde68a", accent: "#ca8a04", icon: "BELL" },
  { id: "04", title: "카페 키오스크", subtitle: "매장/포장 먼저 체크", left: "고민중", right: "빠른 주문", bg1: "#ffedd5", bg2: "#fed7aa", accent: "#ea580c", icon: "KIOSK" },
  { id: "05", title: "편의점 만능", subtitle: "한 곳에서 생활 문제 해결", left: "배고픔", right: "충전+식사", bg1: "#dcfce7", bg2: "#bbf7d0", accent: "#16a34a", icon: "STORE" },
  { id: "06", title: "날씨 변동", subtitle: "비, 바람, 미세먼지까지 체크", left: "맑음", right: "우산", bg1: "#f3e8ff", bg2: "#e9d5ff", accent: "#9333ea", icon: "WEATHER" },
  { id: "07", title: "말투의 힘", subtitle: "짧은 존댓말로 분위기 UP", left: "어색", right: "감사합니다", bg1: "#fee2e2", bg2: "#fecaca", accent: "#dc2626", icon: "TALK" },
  { id: "08", title: "밤 문화", subtitle: "1차 끝? 아직 2차가 남았다", left: "집 가자", right: "2차 가자", bg1: "#e0e7ff", bg2: "#c7d2fe", accent: "#4f46e5", icon: "NIGHT" },
];

const iconMarkup = {
  SUBWAY: `<rect x="78" y="84" width="84" height="54" rx="10" fill="white" opacity="0.92"/><rect x="88" y="96" width="24" height="16" rx="3" fill="#93c5fd"/><rect x="118" y="96" width="24" height="16" rx="3" fill="#93c5fd"/><circle cx="98" cy="128" r="4" fill="#1f2937"/><circle cx="142" cy="128" r="4" fill="#1f2937"/>`,
  CARD: `<rect x="74" y="84" width="92" height="56" rx="12" fill="white" opacity="0.92"/><rect x="74" y="98" width="92" height="10" fill="#67e8f9"/><rect x="84" y="116" width="32" height="8" rx="4" fill="#0e7490"/>`,
  BELL: `<circle cx="120" cy="108" r="28" fill="white" opacity="0.92"/><path d="M120 82c-12 0-20 10-20 22v8l-7 9h54l-7-9v-8c0-12-8-22-20-22z" fill="#facc15"/><circle cx="120" cy="126" r="4" fill="#78350f"/>`,
  KIOSK: `<rect x="88" y="76" width="64" height="92" rx="10" fill="white" opacity="0.92"/><rect x="96" y="88" width="48" height="30" rx="4" fill="#fdba74"/><rect x="102" y="128" width="36" height="8" rx="4" fill="#ea580c"/><rect x="106" y="142" width="28" height="8" rx="4" fill="#ea580c"/>`,
  STORE: `<rect x="76" y="90" width="88" height="56" rx="8" fill="white" opacity="0.92"/><rect x="70" y="82" width="100" height="14" rx="7" fill="#86efac"/><rect x="88" y="106" width="20" height="40" fill="#22c55e"/><rect x="118" y="114" width="34" height="10" rx="5" fill="#16a34a"/>`,
  WEATHER: `<circle cx="96" cy="102" r="16" fill="#facc15"/><ellipse cx="132" cy="112" rx="26" ry="14" fill="white" opacity="0.92"/><path d="M118 128l-6 14m18-14l-6 14m18-14l-6 14" stroke="#7dd3fc" stroke-width="4" stroke-linecap="round"/>`,
  TALK: `<rect x="76" y="86" width="46" height="30" rx="8" fill="white" opacity="0.92"/><path d="M88 116l-6 10 14-8" fill="white" opacity="0.92"/><rect x="118" y="102" width="48" height="30" rx="8" fill="#fee2e2"/><path d="M154 132l8 10-14-8" fill="#fee2e2"/>`,
  NIGHT: `<circle cx="96" cy="98" r="18" fill="#fef08a"/><path d="M102 90a14 14 0 1 0 0 16 10 10 0 1 1 0-16z" fill="#4f46e5"/><rect x="124" y="96" width="38" height="50" rx="4" fill="white" opacity="0.92"/><rect x="132" y="106" width="8" height="8" fill="#818cf8"/><rect x="146" y="106" width="8" height="8" fill="#818cf8"/><rect x="132" y="120" width="8" height="8" fill="#818cf8"/><rect x="146" y="120" width="8" height="8" fill="#818cf8"/>`,
};

const makeSvg = (scene) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1600" height="900" viewBox="0 0 1600 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg${scene.id}" x1="0" y1="0" x2="1600" y2="900" gradientUnits="userSpaceOnUse">
      <stop stop-color="${scene.bg1}"/>
      <stop offset="1" stop-color="${scene.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg${scene.id})"/>
  <rect x="68" y="64" width="1464" height="772" rx="42" fill="white" fill-opacity="0.54"/>
  <rect x="96" y="96" width="768" height="560" rx="34" fill="${scene.accent}" fill-opacity="0.16"/>
  <g transform="translate(180,180)">${iconMarkup[scene.icon]}</g>

  <circle cx="1060" cy="330" r="118" fill="white"/>
  <circle cx="1060" cy="302" r="46" fill="#fde68a"/>
  <rect x="982" y="352" width="156" height="142" rx="72" fill="#1f2937"/>
  <circle cx="1310" cy="360" r="104" fill="white"/>
  <circle cx="1310" cy="336" r="40" fill="#a7f3d0"/>
  <rect x="1242" y="382" width="136" height="130" rx="62" fill="#334155"/>

  <rect x="960" y="520" width="200" height="70" rx="35" fill="white"/>
  <text x="1060" y="564" text-anchor="middle" font-size="34" font-family="Arial, sans-serif" fill="#111827">${scene.left}</text>
  <rect x="1204" y="520" width="220" height="70" rx="35" fill="white"/>
  <text x="1314" y="564" text-anchor="middle" font-size="34" font-family="Arial, sans-serif" fill="#111827">${scene.right}</text>

  <text x="110" y="720" font-size="72" font-weight="700" font-family="Arial, sans-serif" fill="#111827">${scene.title}</text>
  <text x="110" y="786" font-size="40" font-family="Arial, sans-serif" fill="#374151">${scene.subtitle}</text>
  <rect x="110" y="810" width="260" height="10" rx="5" fill="${scene.accent}"/>
</svg>
`;

const outDir = path.join(process.cwd(), "public", "images", "korea101", "comic");
await mkdir(outDir, { recursive: true });

for (const scene of scenes) {
  const outputPath = path.join(outDir, `scene-${scene.id}.svg`);
  await writeFile(outputPath, makeSvg(scene), "utf8");
}

console.log(`Generated ${scenes.length} comic scene SVG files in ${outDir}`);
