import Image from "next/image";
import type { Lang } from "@/lib/i18n";

type AreasMiniMapProps = {
  lang: Lang;
};

export function AreasMiniMap({ lang }: AreasMiniMapProps) {
  const label = lang === "ko" ? "서울 지역 한눈에 보기" : "Seoul areas at a glance";
  const helper =
    lang === "ko"
      ? "지역 위치를 빠르게 파악할 수 있는 고정 미니맵입니다."
      : "A fixed mini map for quick area orientation.";
  return (
    <div className="mb-8 rounded-3xl border border-black/5 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-6">
      <div className="mb-3">
        <h2 className="text-xl font-semibold tracking-tight">{label}</h2>
        <p className="mt-1 text-sm text-zinc-600">{helper}</p>
      </div>
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <div className="relative" style={{ aspectRatio: "16 / 9" }}>
          <Image
            src="/images/areas/seoul-mini-map-new.png"
            alt={lang === "ko" ? "서울 미니맵" : "Seoul mini map"}
            fill
            sizes="(max-width: 768px) 100vw, 900px"
            className="object-cover"
            priority={false}
          />
        </div>
      </div>
    </div>
  );
}
