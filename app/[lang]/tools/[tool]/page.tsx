import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { OliveYoungBudgetBuilder } from "@/components/OliveYoungBudgetBuilder";
import { RightNowDecisionTool } from "@/components/RightNowDecisionTool";
import { TMoneyLoadCalculator } from "@/components/TMoneyLoadCalculator";
import { TravelCalculator } from "@/components/TravelCalculator";
import { isLang, type Lang } from "@/lib/i18n";
import { TOOL_IDS, type ToolId, getToolCopy } from "@/lib/tools";

type ToolPageProps = {
  params: Promise<{ lang: string; tool: string }>;
};

function isToolId(value: string): value is ToolId {
  return TOOL_IDS.includes(value as ToolId);
}

function ToolComponent({ lang, tool }: { lang: Lang; tool: ToolId }) {
  if (tool === "real-cost") return <TravelCalculator lang={lang} />;
  if (tool === "tmoney-load") return <TMoneyLoadCalculator lang={lang} />;
  if (tool === "olive-budget") return <OliveYoungBudgetBuilder lang={lang} />;
  return <RightNowDecisionTool lang={lang} />;
}

export default async function ToolDetailPage({ params }: ToolPageProps) {
  const { lang, tool } = await params;
  if (!isLang(lang) || !isToolId(tool)) notFound();

  const locale = lang as Lang;
  const copy = getToolCopy(locale, tool);
  const back = locale === "ko" ? "도구 목록으로" : locale === "ja" ? "ツール一覧へ" : locale.startsWith("zh") ? "返回工具列表" : "Back to tools";
  const isRightNow = tool === "right-now";

  return (
    <Container className="py-10 sm:py-14">
      <Link href={`/${locale}/tools`} className="text-sm font-semibold text-zinc-600">
        {back}
      </Link>
      {!isRightNow ? (
        <section className="mt-4 rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{copy.title}</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-300">{copy.desc}</p>
        </section>
      ) : null}
      <div className={isRightNow ? "mt-3" : "mt-6"}>
        <ToolComponent lang={locale} tool={tool} />
      </div>
    </Container>
  );
}
