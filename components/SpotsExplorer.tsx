"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TagBadge } from "@/components/TagBadge";
import { toGoogleMapSearchUrl, toPerplexitySearchUrl, type SpotPick } from "@/lib/spot-picks";
import type { Lang } from "@/lib/i18n";

type SortKey = "default" | "name" | "area";

type SpotsExplorerProps = {
  locale: Lang;
  spots: SpotPick[];
  initialQuery: string;
  initialAreas: string[];
  initialSort: SortKey;
  sourceLabel: {
    area: string;
    map: string;
    pplx: string;
    spot: string;
    note: string;
    price: string;
    closed: string;
  };
};

function normalizeText(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function sortSpots(spots: SpotPick[], sort: SortKey): SpotPick[] {
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

export function SpotsExplorer({
  locale,
  spots,
  initialQuery,
  initialAreas,
  initialSort,
  sourceLabel,
}: SpotsExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);
  const [selectedAreas, setSelectedAreas] = useState(initialAreas);
  const [sortKey, setSortKey] = useState<SortKey>(initialSort);
  const [panelOpen, setPanelOpen] = useState(Boolean(initialQuery || initialAreas.length > 0));

  const allAreas = useMemo(
    () => Array.from(new Set(spots.map((spot) => spot.area))).sort((a, b) => a.localeCompare(b)),
    [spots],
  );

  const filteredAndSorted = useMemo(() => {
    const queryLower = normalizeText(query);
    const filtered = spots.filter((spot) => {
      const byArea = selectedAreas.length === 0 || selectedAreas.includes(spot.area);
      if (!byArea) return false;
      if (!queryLower) return true;
      const searchable = normalizeText(`${spot.name} ${spot.area} ${spot.summary} ${spot.price} ${spot.closed}`);
      return searchable.includes(queryLower);
    });
    return sortSpots(filtered, sortKey);
  }, [query, selectedAreas, sortKey, spots]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (sortKey !== "default") params.set("sort", sortKey);
      selectedAreas.forEach((item) => params.append("area", item));
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    }, 220);
    return () => clearTimeout(timeout);
  }, [query, sortKey, selectedAreas, router, pathname]);

  const ui =
    locale === "ko"
      ? {
          toggle: "검색/필터",
          searchPlaceholder: "이름·권역·설명으로 검색",
          areas: "권역 필터",
          all: "전체",
          clear: "초기화",
          noResult: "조건에 맞는 스팟이 없습니다.",
          count: `${filteredAndSorted.length}${selectedAreas.length > 0 || query ? ` / 전체 ${spots.length}` : ""}개 스팟`,
        }
      : {
          toggle: "Search/Filter",
          searchPlaceholder: "Search name, area, or notes",
          areas: "Filter by area",
          all: "All",
          clear: "Reset",
          noResult: "No spots match the current filters.",
          count: `${filteredAndSorted.length}${selectedAreas.length > 0 || query ? ` of ${spots.length}` : ""} spots`,
        };

  const clearAll = () => {
    setQuery("");
    setSelectedAreas([]);
    setSortKey("default");
  };

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) => (prev.includes(area) ? prev.filter((item) => item !== area) : [...prev, area]));
  };

  return (
    <>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setPanelOpen((prev) => !prev)}
          className={`rounded-full border px-3 py-1 text-xs ${panelOpen ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700"}`}
        >
          {ui.toggle}
        </button>
        <TagBadge>{ui.count}</TagBadge>
      </div>

      {panelOpen ? (
        <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-3">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={ui.searchPlaceholder}
            className="h-9 w-full rounded-full border border-zinc-300 bg-white px-4 text-sm text-zinc-700 outline-none ring-zinc-300 focus:ring"
          />
          <p className="mt-3 mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">{ui.areas}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedAreas([])}
              className={`rounded-full border px-3 py-1 text-xs ${selectedAreas.length === 0 ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700"}`}
            >
              {ui.all}
            </button>
            {allAreas.map((area) => {
              const isSelected = selectedAreas.includes(area);
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleArea(area)}
                  className={`rounded-full border px-3 py-1 text-xs ${isSelected ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700"}`}
                >
                  {area}
                </button>
              );
            })}
          </div>
          <div className="mt-3">
            <button
              type="button"
              onClick={clearAll}
              className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs text-zinc-700"
            >
              {ui.clear}
            </button>
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white/95 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        {filteredAndSorted.length === 0 ? (
          <div className="p-8 text-sm text-zinc-600">
            <p>{ui.noResult}</p>
          </div>
        ) : null}
        <div className="space-y-3 p-3 md:hidden">
          {filteredAndSorted.map((spot) => (
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
                <th className="px-4 py-3">
                  <button type="button" onClick={() => setSortKey("name")} className="inline-flex items-center gap-1 hover:text-zinc-900">
                    {sourceLabel.spot}
                    {sortKey === "name" ? "▲" : ""}
                  </button>
                </th>
                <th className="px-4 py-3">
                  <button type="button" onClick={() => setSortKey("area")} className="inline-flex items-center gap-1 hover:text-zinc-900">
                    {sourceLabel.area}
                    {sortKey === "area" ? "▲" : ""}
                  </button>
                </th>
                <th className="px-4 py-3">{sourceLabel.note}</th>
                <th className="px-4 py-3">{sourceLabel.price}</th>
                <th className="px-4 py-3">{sourceLabel.closed}</th>
                <th className="px-4 py-3">{sourceLabel.map}</th>
                <th className="px-4 py-3">{sourceLabel.pplx}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredAndSorted.map((spot) => (
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
    </>
  );
}
