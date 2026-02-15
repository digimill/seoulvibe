import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { TagBadge } from "@/components/TagBadge";
import { getCopy, isLang, type Lang } from "@/lib/i18n";
import { getSpotPicks, toGoogleMapSearchUrl, toPerplexitySearchUrl, type SpotPick } from "@/lib/spot-picks";

type SpotsPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ sort?: string; q?: string; area?: string | string[] }>;
};

function sortSpots(spots: SpotPick[], sort: string): SpotPick[] {
  const copy = [...spots];
  if (sort === "name") {
    return copy.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sort === "area") {
    return copy.sort((a, b) => {
      const areaCompare = a.area.localeCompare(b.area);
      if (areaCompare !== 0) return areaCompare;
      return a.name.localeCompare(b.name);
    });
  }
  return copy;
}

function normalizeText(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function parseAreas(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : [value];
  return Array.from(
    new Set(
      raw
        .flatMap((item) => item.split(","))
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

export default async function SpotsPage({ params, searchParams }: SpotsPageProps) {
  const { lang } = await params;
  const { sort, q, area } = await searchParams;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const sortKey = sort === "name" || sort === "area" ? sort : "default";
  const query = (q ?? "").trim();
  const queryLower = normalizeText(query);
  const t = getCopy(locale);
  const sourceLabel =
    locale === "ko"
      ? { area: "대략적 위치", map: "지도", pplx: "검색", spot: "스팟", note: "설명", price: "가격대(비용)", closed: "휴무일" }
      : { area: "Area", map: "Map", pplx: "Search", spot: "Spot", note: "Description", price: "Price", closed: "Closed days" };
  const spotPool = getSpotPicks(locale);
  const allAreas = Array.from(new Set(spotPool.map((spot) => spot.area))).sort((a, b) => a.localeCompare(b));
  const selectedAreas = parseAreas(area).filter((item) => allAreas.includes(item));
  const filteredSpots = spotPool.filter((spot) => {
    const byArea = selectedAreas.length === 0 || selectedAreas.includes(spot.area);
    if (!byArea) return false;
    if (!queryLower) return true;
    const searchable = normalizeText(`${spot.name} ${spot.area} ${spot.summary} ${spot.price} ${spot.closed}`);
    return searchable.includes(queryLower);
  });
  const curatedSpots = sortSpots(filteredSpots, sortKey);
  const toSpotsHref = (next: { sort?: string; q?: string; areas?: string[] }) => {
    const params = new URLSearchParams();
    if (next.sort && next.sort !== "default") params.set("sort", next.sort);
    if (next.q && next.q.trim()) params.set("q", next.q.trim());
    (next.areas ?? []).forEach((item) => params.append("area", item));
    const queryString = params.toString();
    return `/${locale}/spots${queryString ? `?${queryString}` : ""}`;
  };
  const sortLabels =
    locale === "ko"
      ? { default: "기본순", name: "이름순", area: "권역순" }
      : { default: "Default", name: "By name", area: "By area" };
  const ui =
    locale === "ko"
      ? {
          searchPlaceholder: "이름·권역·설명으로 검색",
          search: "검색",
          areas: "권역 필터",
          clear: "초기화",
          noResult: "조건에 맞는 스팟이 없습니다.",
          count: `${curatedSpots.length}${selectedAreas.length > 0 || query ? ` / 전체 ${spotPool.length}` : ""}개 스팟`,
        }
      : {
          searchPlaceholder: "Search name, area, or notes",
          search: "Search",
          areas: "Filter by area",
          clear: "Clear",
          noResult: "No spots match the current filters.",
          count: `${curatedSpots.length}${selectedAreas.length > 0 || query ? ` of ${spotPool.length}` : ""} spots`,
        };

  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t.featuredSpots}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600 sm:text-base">
          {locale === "ko"
            ? "요즘 서울 무드와 이동 동선을 같이 챙길 수 있는 장소만 모았습니다."
            : "A practical list of places that combine local mood and smooth movement."}
        </p>
        <form method="get" action={`/${locale}/spots`} className="mt-4 flex flex-wrap items-center gap-2">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder={ui.searchPlaceholder}
            className="h-9 w-full min-w-56 rounded-full border border-zinc-300 bg-white px-4 text-sm text-zinc-700 outline-none ring-zinc-300 focus:ring sm:w-auto sm:flex-1"
          />
          {sortKey !== "default" ? <input type="hidden" name="sort" value={sortKey} /> : null}
          {selectedAreas.map((item) => (
            <input key={item} type="hidden" name="area" value={item} />
          ))}
          <button
            type="submit"
            className="inline-flex h-9 items-center rounded-full border border-zinc-900 bg-zinc-900 px-4 text-xs font-medium text-white"
          >
            {ui.search}
          </button>
          <a
            href={`/${locale}/spots`}
            className="inline-flex h-9 items-center rounded-full border border-zinc-300 bg-white px-4 text-xs font-medium text-zinc-700"
          >
            {ui.clear}
          </a>
        </form>
        <div className="mt-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">{ui.areas}</p>
          <div className="flex flex-wrap gap-2">
            {allAreas.map((item) => {
              const isSelected = selectedAreas.includes(item);
              const nextAreas = isSelected ? selectedAreas.filter((v) => v !== item) : [...selectedAreas, item];
              return (
                <a
                  key={item}
                  href={toSpotsHref({ sort: sortKey, q: query, areas: nextAreas })}
                  className={`rounded-full border px-3 py-1 text-xs ${isSelected ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700"}`}
                >
                  {item}
                </a>
              );
            })}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <TagBadge>{ui.count}</TagBadge>
          <a
            href={toSpotsHref({ sort: "default", q: query, areas: selectedAreas })}
            className={`rounded-full border px-3 py-1 text-xs ${sortKey === "default" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700"}`}
          >
            {sortLabels.default}
          </a>
          <a
            href={toSpotsHref({ sort: "name", q: query, areas: selectedAreas })}
            className={`rounded-full border px-3 py-1 text-xs ${sortKey === "name" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700"}`}
          >
            {sortLabels.name}
          </a>
          <a
            href={toSpotsHref({ sort: "area", q: query, areas: selectedAreas })}
            className={`rounded-full border px-3 py-1 text-xs ${sortKey === "area" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700"}`}
          >
            {sortLabels.area}
          </a>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white/95 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        {curatedSpots.length === 0 ? (
          <div className="p-8 text-sm text-zinc-600">
            <p>{ui.noResult}</p>
          </div>
        ) : null}
        <div className="space-y-3 p-3 md:hidden">
          {curatedSpots.map((spot) => (
            <div key={spot.id} className="rounded-2xl border border-black/5 bg-white p-4">
              <p className="text-base font-semibold text-zinc-900">{spot.name}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <TagBadge>{spot.area}</TagBadge>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{spot.summary}</p>
              <p className="mt-2 text-xs text-zinc-600">
                <span className="font-medium">{sourceLabel.price}:</span> {spot.price}
              </p>
              <p className="mt-1 text-xs text-zinc-600">
                <span className="font-medium">{sourceLabel.closed}:</span> {spot.closed}
              </p>
              <div className="mt-3 flex gap-2">
                <a
                  href={toGoogleMapSearchUrl(spot.map_query)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex whitespace-nowrap rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  {sourceLabel.map}
                </a>
                <a
                  href={toPerplexitySearchUrl(spot.map_query, locale)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex whitespace-nowrap rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  {sourceLabel.pplx}
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden max-h-[70vh] overflow-auto md:block">
          <table className="min-w-full divide-y divide-zinc-200 text-sm">
            <thead className="sticky top-0 bg-zinc-50/95 backdrop-blur">
              <tr className="text-left text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-4 py-3">{sourceLabel.spot}</th>
                <th className="px-4 py-3">{sourceLabel.area}</th>
                <th className="px-4 py-3">{sourceLabel.note}</th>
                <th className="px-4 py-3">{sourceLabel.price}</th>
                <th className="px-4 py-3">{sourceLabel.closed}</th>
                <th className="px-4 py-3">{sourceLabel.map}</th>
                <th className="px-4 py-3">{sourceLabel.pplx}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {curatedSpots.map((spot) => (
                <tr key={spot.id} className="align-top">
                  <td className="px-4 py-3">
                    <p className="min-w-[220px] font-semibold text-zinc-900">{spot.name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <TagBadge>{spot.area}</TagBadge>
                  </td>
                  <td className="max-w-[420px] px-4 py-3 text-zinc-600">{spot.summary}</td>
                  <td className="px-4 py-3 text-zinc-700">{spot.price}</td>
                  <td className="px-4 py-3 text-zinc-700">{spot.closed}</td>
                  <td className="px-4 py-3">
                    <a
                      href={toGoogleMapSearchUrl(spot.map_query)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex whitespace-nowrap rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                      {sourceLabel.map}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={toPerplexitySearchUrl(spot.map_query, locale)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex whitespace-nowrap rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                      {sourceLabel.pplx}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
}
