import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { SpeakButton } from "@/components/SpeakButton";
import { TagBadge } from "@/components/TagBadge";
import { getTips } from "@/lib/content";
import type { LineToUseDetail } from "@/lib/types";
import { getCopy, isLang, type Lang } from "@/lib/i18n";
import { toSpotLink } from "@/lib/maps";

type TipDetailPageProps = {
  params: Promise<{ lang: string; id: string }>;
};

function isLineDetail(value: unknown): value is LineToUseDetail {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.ko === "string" &&
    typeof v.pronunciation_en === "string" &&
    typeof v.pronunciation_local === "string" &&
    typeof v.meaning === "string"
  );
}

function getLineLabels(locale: Lang) {
  if (locale === "ko") {
    return {
      title: "Line to use",
      localPronunciation: "해당언어 발음",
      meaning: "해당언어 뜻",
      meaningMissing: "의미 정보 준비 중",
      listen: "한국어 듣기",
      stop: "정지",
    };
  }
  if (locale === "ja") {
    return {
      title: "Line to use",
      localPronunciation: "この言語の発音",
      meaning: "この言語での意味",
      meaningMissing: "意味情報を準備中",
      listen: "韓国語を再生",
      stop: "停止",
    };
  }
  if (locale === "zh-cn") {
    return {
      title: "Line to use",
      localPronunciation: "本语言发音",
      meaning: "本语言含义",
      meaningMissing: "含义信息准备中",
      listen: "播放韩语",
      stop: "停止",
    };
  }
  if (locale === "zh-tw") {
    return {
      title: "Line to use",
      localPronunciation: "此語言發音",
      meaning: "此語言意思",
      meaningMissing: "意思資訊準備中",
      listen: "播放韓文",
      stop: "停止",
    };
  }
  if (locale === "zh-hk") {
    return {
      title: "Line to use",
      localPronunciation: "此語言讀音",
      meaning: "此語言意思",
      meaningMissing: "意思資訊準備中",
      listen: "播放韓文",
      stop: "停止",
    };
  }
  return {
    title: "Line to use",
    localPronunciation: "Local pronunciation",
    meaning: "Local meaning",
    meaningMissing: "Meaning info coming soon",
    listen: "Play Korean",
    stop: "Stop",
  };
}

function splitLineSegments(text: string): string[] {
  const normalized = text.trim();
  if (!normalized) return [];

  if (normalized.includes("/")) {
    return normalized
      .split("/")
      .map((part) => part.trim())
      .filter(Boolean);
  }

  const sentenceSplit = normalized
    .split(/(?<=[?.!])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return sentenceSplit.length > 0 ? sentenceSplit : [normalized];
}

function toLinePairs(ko: string, pronunciation: string): Array<{ ko: string; pronunciation: string }> {
  const koParts = splitLineSegments(ko);
  const pronunciationParts = splitLineSegments(pronunciation);

  if (koParts.length > 1 && pronunciationParts.length === koParts.length) {
    return koParts.map((part, index) => ({ ko: part, pronunciation: pronunciationParts[index] }));
  }

  return koParts.map((part) => ({ ko: part, pronunciation }));
}

export default async function TipDetailPage({ params }: TipDetailPageProps) {
  const { lang, id } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const t = getCopy(locale);
  const lineLabels = getLineLabels(locale);
  const tip = (await getTips(locale)).find((item) => item.id === id);

  if (!tip) notFound();

  return (
    <Container className="py-12 sm:py-16">
      <Link href={`/${locale}/tips`} className="text-sm text-zinc-500">
        {t.back}
      </Link>
      <div className="mt-4 rounded-3xl border border-black/5 bg-white/90 p-7 shadow-[0_15px_50px_rgba(0,0,0,0.05)] sm:p-10">
        {tip.image ? (
          <div className="relative mb-6 overflow-hidden rounded-2xl" style={{ aspectRatio: "16 / 9" }}>
            <Image
              src={tip.image.src}
              alt={tip.image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{tip.title}</h1>
        <div className="mt-3 max-w-3xl space-y-2 text-base leading-7 text-zinc-700">
          <p>{tip.summary}</p>
          {tip.hook ? <p>{tip.hook}</p> : null}
          {tip.friend_note ? <p>{tip.friend_note}</p> : null}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {tip.tags.map((tag) => (
            <TagBadge key={tag}>{tag}</TagBadge>
          ))}
        </div>

        <dl className="mt-8 grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">What to know</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-800">{tip.what_to_know}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Why it matters</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-800">{tip.why_it_matters}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Avoid this</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-800">{tip.avoid_this}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Quick fix</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-800">{tip.quick_fix}</dd>
          </div>
          {tip.real_scene ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Real scene</dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-800">{tip.real_scene}</dd>
            </div>
          ) : null}
          {tip.local_move ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Local move</dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-800">{tip.local_move}</dd>
            </div>
          ) : null}
          {tip.line_to_use ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{lineLabels.title}</dt>
              {(() => {
                if (isLineDetail(tip.line_to_use)) {
                  const lineDetail = tip.line_to_use;
                  const linePairs = toLinePairs(lineDetail.ko, lineDetail.pronunciation_local);
                  const isMultiple = linePairs.length > 1;

                  return (
                    <dd className="mt-1 space-y-1 text-sm leading-6 text-zinc-800">
                      {linePairs.map((line, index) => (
                        <p key={`${line.ko}-${index}`} className="flex items-center justify-between gap-3">
                          <span>
                            <span className="font-medium">
                              {lineLabels.localPronunciation}
                              {isMultiple ? ` ${index + 1}` : ""}:
                            </span>{" "}
                            {line.pronunciation}
                          </span>
                          <SpeakButton
                            text={line.ko}
                            lang="ko-KR"
                            idleLabel={lineLabels.listen}
                            speakingLabel={lineLabels.stop}
                          />
                        </p>
                      ))}
                      <p>
                        <span className="font-medium">{lineLabels.meaning}:</span> {lineDetail.meaning}
                      </p>
                    </dd>
                  );
                }

                const singleLine = tip.line_to_use;
                const lines = splitLineSegments(singleLine);
                const isMultiple = lines.length > 1;

                return (
                  <dd className="mt-1 space-y-1 text-sm leading-6 text-zinc-800">
                    {lines.map((line, index) => (
                      <p key={`${line}-${index}`} className="flex items-center justify-between gap-3">
                        <span>
                          <span className="font-medium">
                            {lineLabels.localPronunciation}
                            {isMultiple ? ` ${index + 1}` : ""}:
                          </span>{" "}
                          {line}
                        </span>
                        <SpeakButton text={line} lang="ko-KR" idleLabel={lineLabels.listen} speakingLabel={lineLabels.stop} />
                      </p>
                    ))}
                    <p>
                      <span className="font-medium">{lineLabels.meaning}:</span> {lineLabels.meaningMissing}
                    </p>
                  </dd>
                );
              })()}
            </div>
          ) : null}
          {tip.quick_checklist && tip.quick_checklist.length > 0 ? (
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Quick checklist</dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-800">{tip.quick_checklist.join(" / ")}</dd>
            </div>
          ) : null}
          {tip.real_spots && tip.real_spots.length > 0 ? (
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Where to try</dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-800">
                {tip.real_spots
                  .map((spot) => {
                    const link = toSpotLink(spot);
                    return (
                      <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-700"
                      >
                        {link.name}
                      </a>
                    );
                  })
                  .reduce<ReactNode[]>((acc, node, index) => (index === 0 ? [node] : [...acc, " / ", node]), [])}
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
    </Container>
  );
}
