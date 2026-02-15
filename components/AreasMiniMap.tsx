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
    { id: "hongdae", name: isKo ? "홍대" : "Hongdae", left: "12.0%", top: "36.1%", width: "25.4%", height: "13.7%" },
    { id: "mangwon", name: isKo ? "망원" : "Mangwon", left: "12.0%", top: "62.0%", width: "25.1%", height: "14.2%" },
    { id: "bukchon", name: isKo ? "북촌" : "Bukchon", left: "30.6%", top: "16.5%", width: "19.0%", height: "13.8%" },
    { id: "euljiro", name: isKo ? "을지로" : "Euljiro", left: "45.8%", top: "30.0%", width: "19.5%", height: "10.0%" },
    { id: "seongsu", name: isKo ? "성수" : "Seongsu", left: "64.8%", top: "25.4%", width: "20.4%", height: "17.8%" },
    { id: "gangnam", name: isKo ? "강남" : "Gangnam", left: "61.8%", top: "78.0%", width: "20.4%", height: "13.8%" },
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
