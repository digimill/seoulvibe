import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/Container";
import { PlanBudgetDesigner } from "@/components/PlanBudgetDesigner";
import { isLang, type Lang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

function copy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "일일 예산",
      lead: "Plan은 여행 전체 소비 구조를 설계하는 화면입니다. 집행 판단은 Now에서 진행합니다.",
      baselineTitle: "전략 설계",
      oliveCta: "Olive Young 예산 설계로 이동",
      nowCta: "Now 집행 화면으로 이동",
    };
  }
  if (lang === "ja") {
    return {
      title: "1日予算",
      lead: "行程を確定する前に、現実的な支出基準を先に作りましょう。",
      baselineTitle: "旅行支出の基準線",
      oliveCta: "Olive Young予算ページへ",
      nowCta: "Now実行画面へ",
    };
  }
  if (lang === "zh-cn") {
    return {
      title: "每日预算",
      lead: "在锁定行程前，先建立现实的花费基线。",
      baselineTitle: "旅行花费基线",
      oliveCta: "前往 Olive Young 预算页",
      nowCta: "前往 Now 执行页",
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      title: "每日預算",
      lead: "在鎖定行程前，先建立現實的花費基線。",
      baselineTitle: "旅行花費基線",
      oliveCta: "前往 Olive Young 預算頁",
      nowCta: "前往 Now 執行頁",
    };
  }
  return {
    title: "Daily budget",
    lead: "Plan is for trip-wide spending strategy. Execute decisions in Now.",
    baselineTitle: "Strategy design",
    oliveCta: "Go to Olive Young budget planning",
    nowCta: "Go to Now execution screen",
  };
}

export default async function DailyBudgetPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const locale = lang as Lang;
  const c = copy(locale);

  return (
    <Container className="py-10 sm:py-14">
      <section className="rounded-3xl border border-zinc-900 bg-zinc-950 p-4 text-zinc-100 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{c.title}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">{c.lead}</p>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">{c.baselineTitle}</h2>
        <div className="mt-4">
          <PlanBudgetDesigner lang={locale} />
        </div>
      </section>
      <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
        <Link href={`/${locale}/plan/olive-young`} className="rounded-full border border-zinc-900 px-4 py-2 text-zinc-900">
          {c.oliveCta}
        </Link>
        <Link href={`/${locale}/now/spend-log`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">
          {c.nowCta}
        </Link>
      </div>
    </Container>
  );
}
