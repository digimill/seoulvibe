import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { NowSubwayDirectionDecoder } from "@/components/NowSubwayDirectionDecoder";
import { isLang, type Lang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

function copy(lang: Lang) {
  if (lang === "ko") {
    return {
      a1: "지하철 상세 가이드",
      a2: "T-money 빠른 체크",
      a3: "혼잡 회피",
    };
  }
  if (lang === "ja") {
    return {
      a1: "地下鉄ガイドを見る",
      a2: "T-money クイックチェック",
      a3: "混雑回避",
    };
  }
  if (lang === "zh-cn") {
    return {
      a1: "打开地铁指南",
      a2: "T-money 快速检查",
      a3: "避开人潮",
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      a1: "開啟地鐵指南",
      a2: "T-money 快速檢查",
      a3: "避開人潮",
    };
  }
  return {
    a1: "Open subway guide",
    a2: "T-money quick check",
    a3: "Crowd escape",
  };
}

export default async function NowSubwayHelpPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const locale = lang as Lang;
  const c = copy(locale);

  return (
    <Container className="py-10 sm:py-14">
      <NowSubwayDirectionDecoder lang={locale} />

      <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
        <Link href={`/${locale}/tips/subway-map-confusion-cuts`} className="rounded-full border border-zinc-900 px-4 py-2 text-zinc-900">{c.a1}</Link>
        <Link href={`/${locale}/now/t-money`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">{c.a2}</Link>
        <Link href={`/${locale}/now/crowd-escape`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">{c.a3}</Link>
      </div>
    </Container>
  );
}
