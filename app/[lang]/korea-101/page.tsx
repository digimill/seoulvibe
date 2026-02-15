import { readdirSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
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

const CANONICAL_SCENE_IDS = [
  "name-origin-and-identity",
  "air-routes-airports-impression",
  "timezone-and-daily-tempo",
  "korea-big-picture-expanded",
  "history-core-journey",
  "geography-climate-structure",
  "politics-democracy-citizens",
  "economy-industry-tech",
  "society-education-work-life",
  "culture-code-etiquette",
  "korean-cinema-famous",
  "kdrama-pop-culture",
  "kpop-entertainment",
  "food-culture-famous",
  "technology-daily-infra",
  "security-military-context-expanded",
  "currency-payment-finance-expanded",
  "korea-famous-facts-encyclopedic-fun",
] as const;

const AVAILABLE_SCENE_IMAGES = new Set(
  readdirSync(path.join(process.cwd(), "public", "images", "korea101", "comic"))
    .map((name) => name.match(/^(\d{2})\.png$/)?.[1])
    .filter((name): name is string => Boolean(name)),
);

function toSceneNo(value: number): string {
  return value.toString().padStart(2, "0");
}

function softenKoreanTone(text: string): string {
  return text
    .replace(/입니다\./g, "이에요.")
    .replace(/입니다/g, "이에요")
    .replace(/합니다\./g, "해요.")
    .replace(/합니다/g, "해요")
    .replace(/됩니다\./g, "돼요.")
    .replace(/됩니다/g, "돼요")
    .replace(/있습니다\./g, "있어요.")
    .replace(/있습니다/g, "있어요")
    .replace(/없습니다\./g, "없어요.")
    .replace(/없습니다/g, "없어요")
    .replace(/좋습니다\./g, "좋아요.")
    .replace(/좋습니다/g, "좋아요")
    .replace(/많습니다\./g, "많아요.")
    .replace(/많습니다/g, "많아요");
}

function softenEnglishTone(text: string): string {
  return text
    .replace(/do not/gi, "don't")
    .replace(/does not/gi, "doesn't")
    .replace(/is not/gi, "isn't")
    .replace(/are not/gi, "aren't")
    .replace(/cannot/gi, "can't");
}

function softenJapaneseTone(text: string): string {
  return text.replace(/です\./g, "ですよ。").replace(/ます\./g, "ますよ。");
}

function narrate(locale: Lang, text: string): string {
  if (locale === "ko") return softenKoreanTone(text);
  if (locale === "en") return softenEnglishTone(text);
  if (locale === "ja") return softenJapaneseTone(text);
  return text;
}

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
              "technology-daily-infra",
              "security-military-context-expanded",
              "currency-payment-finance-expanded",
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
  const canonicalSceneIndex = new Map<string, number>(CANONICAL_SCENE_IDS.map((id, index) => [id, index + 1]));
  const entryIndex = new Map(entries.map((entry, index) => [entry.id, index + 1] as const));
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
                <section
                  key={entry.id}
                  className="rounded-3xl border border-black/5 bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.04)] sm:p-8"
                >
                  {(() => {
                    const sceneNumber = canonicalSceneIndex.get(entry.id) ?? entryIndex.get(entry.id) ?? 1;
                    const sceneNo = toSceneNo(sceneNumber);
                    const imageSrc = `/images/korea101/comic/${sceneNo}.png`;
                    const hasSceneImage = AVAILABLE_SCENE_IMAGES.has(sceneNo);

                    return (
                      <>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                          {sceneLabel} {sceneNumber}
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{entry.title}</h3>
                        {hasSceneImage ? (
                          <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
                            <Image
                              src={imageSrc}
                              alt={`${sceneLabel} ${sceneNumber} - ${entry.title}`}
                              width={1200}
                              height={1600}
                              sizes="(max-width: 768px) 100vw, 900px"
                              className="h-auto w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="mt-5 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
                            {locale === "ko" ? `장면 ${sceneNumber} 이미지 준비 중` : `Scene ${sceneNumber} image coming soon`}
                          </div>
                        )}
                      </>
                    );
                  })()}
                  <div className="mt-5 space-y-3 text-base leading-8 text-zinc-700">
                    <p>
                      {narrate(locale, `${entry.comic_scene} ${entry.summary}`)}
                    </p>
                    {entry.friend_note ? (
                      <p>{narrate(locale, entry.friend_note)}</p>
                    ) : null}
                    <p>{narrate(locale, entry.core_idea)}</p>
                    <p>{narrate(locale, `${entry.fun_fact} ${entry.real_life_tip}`)}</p>
                  </div>
                </section>
              ))}
            </section>
          ))}
        </div>
      </article>
    </Container>
  );
}
