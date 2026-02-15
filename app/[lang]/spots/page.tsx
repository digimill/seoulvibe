import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { SpotsExplorer } from "@/components/SpotsExplorer";
import { getCopy, isLang, type Lang } from "@/lib/i18n";
import { getSpotPicks } from "@/lib/spot-picks";

type SortKey = "default" | "name" | "area";

type SpotsPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ sort?: string; q?: string; area?: string | string[] }>;
};

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
  const sortKey: SortKey = sort === "name" || sort === "area" ? sort : "default";
  const t = getCopy(locale);
  const sourceLabel =
    locale === "ko"
      ? { area: "대략적 위치", map: "지도", pplx: "검색", spot: "스팟", note: "설명", price: "가격대(비용)", closed: "휴무일" }
      : { area: "Area", map: "Map", pplx: "Search", spot: "Spot", note: "Description", price: "Price", closed: "Closed days" };

  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t.featuredSpots}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600 sm:text-base">
          {locale === "ko"
            ? "요즘 서울 무드와 이동 동선을 같이 챙길 수 있는 장소만 모았습니다."
            : "A practical list of places that combine local mood and smooth movement."}
        </p>
      </div>

      <SpotsExplorer
        locale={locale}
        spots={getSpotPicks(locale)}
        initialQuery={(q ?? "").trim()}
        initialAreas={parseAreas(area)}
        initialSort={sortKey}
        sourceLabel={sourceLabel}
      />
    </Container>
  );
}
