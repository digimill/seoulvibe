import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { getKorea101 } from "@/lib/content";
import { getCopy, isLang, type Lang } from "@/lib/i18n";

type Korea101PageProps = {
  params: Promise<{ lang: string }>;
};

type Chapter = {
  id: string;
  title: string;
  description: string;
  entryIds: string[];
};

export default async function Korea101Page({ params }: Korea101PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const t = getCopy(locale);
  const entries = await getKorea101(locale);
  const introText =
    locale === "ko"
      ? "한국을 정확히 설명하려는 백과사전형 페이지가 아니라, 사람들이 실제로 체감하는 한국의 분위기와 맥락을 따라 읽는 스크롤형 소개 페이지입니다. 여행자가 궁금해하는 포인트를 중심으로, 사실과 인상을 같이 담았습니다."
      : "A single-scroll narrative about how people actually experience Korea, not an encyclopedic definition. It mixes practical curiosity with cultural impressions and fun trivia.";
  const sceneLabel = locale === "ko" ? "장면" : "Scene";
  const chapters: Chapter[] =
    locale === "ko"
      ? [
          {
            id: "chapter-basics",
            title: "1부. 한국의 기본 프레임",
            description: "이름의 유래부터 공항, 시간감각, 역사·지리의 큰 그림까지.",
            entryIds: [
              "name-origin-and-identity",
              "air-routes-airports-impression",
              "timezone-and-daily-tempo",
              "korea-big-picture-expanded",
              "history-core-journey",
              "geography-climate-structure",
            ],
          },
          {
            id: "chapter-society",
            title: "2부. 정치·경제·사회·생활 시스템",
            description: "한국 사회가 실제로 굴러가는 방식과 여행자가 체감하는 구조.",
            entryIds: [
              "politics-democracy-citizens",
              "economy-industry-tech",
              "society-education-work-life",
              "culture-code-etiquette",
              "technology-daily-infra",
              "security-military-context-expanded",
              "currency-payment-finance-expanded",
            ],
          },
          {
            id: "chapter-culture",
            title: "3부. 대중문화·유명한 것·재밌는 상식",
            description: "영화, 드라마, K-pop, 음식, 그리고 한국식 TMI.",
            entryIds: [
              "korean-cinema-famous",
              "kdrama-pop-culture",
              "kpop-entertainment",
              "food-culture-famous",
              "korea-famous-facts-encyclopedic-fun",
            ],
          },
        ]
      : [
          {
            id: "chapter-overview",
            title: "Overview",
            description: "A full single-scroll narrative about Korea.",
            entryIds: entries.map((entry) => entry.id),
          },
        ];
  const entryIndex = new Map(entries.map((entry, index) => [entry.id, index] as const));
  const chapterBlocks = chapters
    .map((chapter) => ({
      ...chapter,
      items: chapter.entryIds
        .map((entryId) => entries.find((entry) => entry.id === entryId))
        .filter((entry): entry is (typeof entries)[number] => Boolean(entry)),
    }))
    .filter((chapter) => chapter.items.length > 0);
  const knownIds = new Set(chapterBlocks.flatMap((chapter) => chapter.items.map((item) => item.id)));
  const remaining = entries.filter((entry) => !knownIds.has(entry.id));
  if (remaining.length > 0) {
    chapterBlocks.push({
      id: "chapter-more",
      title: locale === "ko" ? "추가 섹션" : "More",
      description: locale === "ko" ? "추가로 포함된 읽을거리." : "Additional reading.",
      entryIds: remaining.map((entry) => entry.id),
      items: remaining,
    });
  }

  return (
    <Container className="py-12 sm:py-16">
      <article className="mx-auto max-w-4xl">
        <header className="rounded-3xl border border-orange-200/80 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-7 shadow-[0_12px_40px_rgba(0,0,0,0.05)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-700/80">{t.nav.korea101}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">{t.featuredKorea101}</h1>
          <p className="mt-5 text-base leading-8 text-zinc-700 sm:text-lg">{introText}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {chapterBlocks.map((chapter) => (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                className="rounded-full border border-orange-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700"
              >
                {chapter.title}
              </a>
            ))}
          </div>
        </header>

        <div className="mt-8 space-y-10">
          {chapterBlocks.map((chapter) => (
            <section key={chapter.id} id={chapter.id} className="space-y-6 scroll-mt-24">
              <div className="rounded-3xl border border-zinc-200/80 bg-zinc-50/80 p-5 sm:p-7">
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{chapter.title}</h2>
                <p className="mt-2 text-sm leading-7 text-zinc-600 sm:text-base">{chapter.description}</p>
              </div>
              {chapter.items.map((entry) => (
                <section key={entry.id} className="rounded-3xl border border-black/5 bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.04)] sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    {sceneLabel} {(entryIndex.get(entry.id) ?? 0) + 1}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{entry.title}</h3>
                  <p className="mt-5 text-base leading-8 text-zinc-700">
                    {entry.comic_scene} {entry.summary} {entry.friend_note ? `${entry.friend_note} ` : ""}
                    {entry.core_idea} {entry.fun_fact} {entry.real_life_tip}
                  </p>
                </section>
              ))}
            </section>
          ))}
        </div>
      </article>
    </Container>
  );
}
