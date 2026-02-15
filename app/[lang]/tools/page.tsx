import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { TravelCalculator } from "@/components/TravelCalculator";
import { TMoneyLoadCalculator } from "@/components/TMoneyLoadCalculator";
import { OliveYoungBudgetBuilder } from "@/components/OliveYoungBudgetBuilder";
import { RightNowDecisionTool } from "@/components/RightNowDecisionTool";
import { isLang, type Lang } from "@/lib/i18n";

type ToolsPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function ToolsPage({ params }: ToolsPageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const copy =
    locale === "ko"
      ? {
          title: "도구",
          desc: "서울에서 바로 쓰는 문제해결 도구입니다. 금액 판단, 교통 충전, 쇼핑 예산, 즉시 동선 결정을 한 번에.",
        }
      : locale === "ja"
        ? {
            title: "ツール",
            desc: "ソウルで即使える問題解決ツール。支出判断、交通チャージ、買い物予算、今すぐの動線決定まで。",
          }
        : locale === "zh-cn"
          ? {
              title: "工具",
              desc: "在首尔可直接使用的问题解决工具。金额判断、交通充值、购物预算、即时动线一次完成。",
            }
          : locale === "zh-tw" || locale === "zh-hk"
            ? {
                title: "工具",
                desc: "在首爾可直接使用的問題解決工具。金額判斷、交通儲值、購物預算與即時動線一次完成。",
              }
            : {
                title: "Tools",
                desc: "Problem-solving tools for Seoul visitors. Judge spending, top up transport, build shopping baskets, and decide what to do now.",
              };

  return (
    <Container className="py-10 sm:py-14">
      <section className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{copy.title}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">{copy.desc}</p>
      </section>

      <div className="mt-6 space-y-6">
        <TravelCalculator lang={locale} />
        <TMoneyLoadCalculator lang={locale} />
        <OliveYoungBudgetBuilder lang={locale} />
        <RightNowDecisionTool lang={locale} />
      </div>
    </Container>
  );
}
