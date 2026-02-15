import Image from "next/image";
import Link from "next/link";
import type { Area } from "@/lib/types";
import type { Lang } from "@/lib/i18n";

type AreasMiniMapProps = {
  areas: Area[];
  lang: Lang;
};

const areaCoords: Record<string, { lat: number; lon: number }> = {
  seongsu: { lat: 37.5448, lon: 127.0557 },
  hongdae: { lat: 37.5563, lon: 126.9236 },
  euljiro: { lat: 37.5665, lon: 126.9910 },
  bukchon: { lat: 37.5826, lon: 126.9830 },
  mangwon: { lat: 37.5560, lon: 126.9102 },
};

const MAP_BOUNDS = {
  minLon: 126.85,
  minLat: 37.50,
  maxLon: 127.12,
  maxLat: 37.63,
};

function latToMercatorY(lat: number): number {
  const rad = (lat * Math.PI) / 180;
  return Math.log(Math.tan(Math.PI / 4 + rad / 2));
}

function toPercentPosition(lat: number, lon: number): { left: string; top: string } {
  const left = ((lon - MAP_BOUNDS.minLon) / (MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon)) * 100;
  const maxY = latToMercatorY(MAP_BOUNDS.maxLat);
  const minY = latToMercatorY(MAP_BOUNDS.minLat);
  const y = latToMercatorY(lat);
  const top = ((maxY - y) / (maxY - minY)) * 100;
  return { left: `${left}%`, top: `${top}%` };
}

export function AreasMiniMap({ areas, lang }: AreasMiniMapProps) {
  const label = lang === "ko" ? "서울 지역 한눈에 보기" : "Seoul areas at a glance";
  const helper =
    lang === "ko"
      ? "핀을 누르면 해당 지역 상세로 이동합니다. (이 지도는 위치 비교용 고정 뷰)"
      : "Tap a pin to open area details. (This map is a fixed reference view.)";
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
          {areas.map((area) => {
            const coord = areaCoords[area.id];
            if (!coord) return null;
            const pos = toPercentPosition(coord.lat, coord.lon);
            return (
              <Link
                key={area.id}
                href={`/${lang}/areas/${area.id}`}
                className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: pos.left, top: pos.top }}
              >
                <span className="absolute left-1/2 top-1/2 block h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-md transition group-hover:scale-110" />
                <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full border border-white bg-blue-600 shadow" />
                <span className="absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap rounded-full border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-700 shadow-sm">
                  {area.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
