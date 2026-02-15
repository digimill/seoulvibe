import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { getProblemQuestion, getProblemSeoBySlug, problemSeoItems } from "@/lib/problem-seo";
import { isLang, type Lang } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

function copy(lang: Lang) {
  if (lang === "ko") return { a: "짧은 답", b: "왜 생기나", c: "지금 할 일", d: "백업 플랜", e: "메인 해결 페이지", all: "20개 문제 모두 보기" };
  if (lang === "ja") return { a: "短い回答", b: "なぜ起きる", c: "やること", d: "バックアップ", e: "メイン解決ページ", all: "20ページを一覧で見る" };
  if (lang === "zh-cn") return { a: "简短结论", b: "为什么会发生", c: "现在怎么做", d: "备用方案", e: "主解决页", all: "查看全部 20 个问题" };
  if (lang === "zh-tw" || lang === "zh-hk") return { a: "簡短結論", b: "為什麼會發生", c: "現在怎麼做", d: "備用方案", e: "主解決頁", all: "查看全部 20 個問題" };
  return { a: "Short direct answer", b: "Why it happens", c: "What to do step by step", d: "Quick backup plan", e: "Link to main Fix page", all: "View all 20 problem pages" };
}

export async function generateStaticParams() {
  return problemSeoItems.flatMap((item) => [
    { lang: "en", slug: item.slug },
    { lang: "ko", slug: item.slug },
    { lang: "ja", slug: item.slug },
    { lang: "zh-cn", slug: item.slug },
    { lang: "zh-tw", slug: item.slug },
    { lang: "zh-hk", slug: item.slug },
  ]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang)) return {};
  const locale = lang as Lang;
  const item = getProblemSeoBySlug(slug);
  if (!item) return {};
  return { title: getProblemQuestion(item, locale), description: item.shortAnswer.join(" ") };
}

export default async function Page({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!isLang(lang)) notFound();
  const locale = lang as Lang;
  const c = copy(locale);
  const item = getProblemSeoBySlug(slug);
  if (!item) notFound();
  const question = getProblemQuestion(item, locale);

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl">{question}</h1>

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">1. {c.a}</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-900 sm:text-base">{item.shortAnswer.map((line)=><li key={line}>- {line}</li>)}</ul>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">2. {c.b}</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-800 sm:text-base">{item.why}</p>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">3. {c.c}</h2>
        <ol className="mt-3 space-y-2 text-sm font-semibold text-zinc-900 sm:text-base">{item.steps.map((step, i)=><li key={step}>{i+1}. {step}</li>)}</ol>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">4. {c.d}</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-900 sm:text-base">{item.backup.map((line)=><li key={line}>- {line}</li>)}</ul>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">5. {c.e}</h2>
        <p className="mt-3 text-sm font-semibold text-zinc-900 sm:text-base"><Link href={item.mainFixHref.replace('/en/', `/${locale}/`)} className="underline">{item.mainFixLabel}</Link></p>
      </section>

      <section className="mt-8">
        <Link href={`/${locale}/problems`} className="text-sm font-semibold text-zinc-700 underline">{c.all}</Link>
      </section>
    </Container>
  );
}
