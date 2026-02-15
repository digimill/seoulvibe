import Image from "next/image";
import Link from "next/link";
import type { Lang } from "@/lib/i18n";

type AreasMiniMapProps = {
  lang: Lang;
};

export function AreasMiniMap({ lang }: AreasMiniMapProps) {
  const label = lang === "ko" ? "서울 지역 한눈에 보기" : "Seoul areas at a glance";
  const helper =
    lang === "ko"
      ? "숙소 기준 핵심 구역 위치를 빠르게 확인하세요."
      : "Quick orientation map for core base areas.";
  const points =
    lang === "ko"
      ? [
          { id: "hongdae", name: "홍대", left: "26%", top: "43%" },
          { id: "bukchon", name: "북촌", left: "51%", top: "32%" },
          { id: "seongsu", name: "성수", left: "68%", top: "42%" },
          { id: "gangnam", name: "강남", left: "67%", top: "63%" },
        ]
      : [
          { id: "hongdae", name: "Hongdae", left: "26%", top: "43%" },
          { id: "bukchon", name: "Bukchon", left: "51%", top: "32%" },
          { id: "seongsu", name: "Seongsu", left: "68%", top: "42%" },
          { id: "gangnam", name: "Gangnam", left: "67%", top: "63%" },
        ];
  return (
    <div className="mb-8 rounded-3xl border border-black/5 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-6">
      <div className="mb-3">
        <h2 className="text-xl font-semibold tracking-tight">{label}</h2>
        <p className="mt-1 text-sm text-zinc-600">{helper}</p>
      </div>
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <div className="relative" style={{ aspectRatio: "16 / 9" }}>
          <Image
            src="/images/areas/seoul-base-map.svg"
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
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: point.left, top: point.top }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-900 bg-white px-3 py-1 text-xs font-bold text-zinc-900 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-red-600" />
                {point.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
