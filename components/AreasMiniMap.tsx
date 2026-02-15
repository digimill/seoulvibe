import Image from "next/image";
import Link from "next/link";
import type { Lang } from "@/lib/i18n";

type AreasMiniMapProps = {
  lang: Lang;
};

type Point = {
  id: string;
  name: string;
  left: string;
  top: string;
  width: string;
  height: string;
};

function getPoints(lang: Lang): Point[] {
  const isKo = lang === "ko";
  return [
    { id: "hongdae", name: isKo ? "홍대" : "Hongdae", left: "9.5%", top: "34.0%", width: "23%", height: "16%" },
    { id: "mangwon", name: isKo ? "망원" : "Mangwon", left: "9.5%", top: "58.0%", width: "24%", height: "17%" },
    { id: "bukchon", name: isKo ? "북촌" : "Bukchon", left: "29.5%", top: "13.0%", width: "24%", height: "15%" },
    { id: "euljiro", name: isKo ? "을지로" : "Euljiro", left: "40.8%", top: "28.5%", width: "15.6%", height: "12.7%" },
    { id: "seongsu", name: isKo ? "성수" : "Seongsu", left: "62.3%", top: "24.8%", width: "20.5%", height: "12.7%" },
    { id: "gangnam", name: isKo ? "강남" : "Gangnam", left: "59.5%", top: "72.0%", width: "26%", height: "17%" },
  ];
}

export function AreasMiniMap({ lang }: AreasMiniMapProps) {
  const label = lang === "ko" ? "서울 지역 한눈에 보기" : "Seoul areas at a glance";
  const helper =
    lang === "ko"
      ? "핀을 눌러 바로 지역 상세로 이동하세요."
      : "Tap a pin to open the area page.";
  const points = getPoints(lang);

  return (
    <div className="mb-8 rounded-3xl border border-black/5 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-6">
      <div className="mb-3">
        <h2 className="text-xl font-semibold tracking-tight">{label}</h2>
        <p className="mt-1 text-sm text-zinc-600">{helper}</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <div className="relative" style={{ aspectRatio: "3 / 2" }}>
          <Image
            src="/images/areas/seoul-mini-map-new.png"
            alt={lang === "ko" ? "서울 미니맵" : "Seoul mini map"}
            fill
            sizes="(max-width: 768px) 100vw, 900px"
            className="object-cover"
            priority={false}
          />

          {points.map((point) => (
            <Link
              key={point.id}
              href={`/${lang}/areas/${point.id}`}
              aria-label={point.name}
              className="absolute rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 hover:bg-zinc-900/5"
              style={{ left: point.left, top: point.top, width: point.width, height: point.height }}
            >
              <span className="block h-full w-full rounded-xl bg-transparent" />
              <span className="sr-only">{point.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
