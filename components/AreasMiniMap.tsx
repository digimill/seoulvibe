import Image from "next/image";
import type { Lang } from "@/lib/i18n";

type AreasMiniMapProps = {
  lang: Lang;
};

export function AreasMiniMap({ lang }: AreasMiniMapProps) {
  const label = lang === "ko" ? "서울 지역 한눈에 보기" : "Seoul areas at a glance";
  const helper =
    lang === "ko"
      ? "지역 위치를 빠르게 파악할 수 있는 지도입니다."
      : "A quick orientation map for Seoul areas.";

  return (
    <div className="mb-6 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 sm:p-5">
      <div className="mb-2">
        <h2 className="text-base font-semibold tracking-tight text-zinc-800">{label}</h2>
        <p className="mt-1 text-xs text-zinc-500">{helper}</p>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="relative" style={{ aspectRatio: "16 / 7" }}>
          <Image
            src="/images/areas/seoul-mini-map-new.png"
            alt={lang === "ko" ? "서울 미니맵" : "Seoul mini map"}
            fill
            sizes="(max-width: 768px) 100vw, 900px"
            className="object-cover opacity-90"
            priority={false}
          />
        </div>
      </div>
    </div>
  );
}
