import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { ExpenseTracker } from "@/components/ExpenseTracker";
import { TravelCalculator } from "@/components/TravelCalculator";
import { isLang, type Lang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

function copy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "지출 로그",
      lead: "여행 중 결제한 금액을 즉시 기록하고, 누적/남은 예산을 바로 확인합니다.",
      useTitle: "언제 쓰나요?",
      useBody: "식사·교통·쇼핑 결제 직후에 실제 지출을 남길 때 사용합니다.",
      diffTitle: "Daily budget와 차이",
      diffBody: "Daily budget는 출발 전 기준선을 잡는 페이지이고, Spend log는 현장에서 실제 사용액을 추적하는 페이지입니다.",
      tracker: "실사용 지출 기록",
      quick: "기록 보조용 빠른 환산",
      a1: "Plan에서 기준선 다시 잡기",
      a2: "올리브영 예산",
    };
  }
  if (lang === "ja") {
    return {
      title: "支出ログ",
      lead: "移動中の実際の支出を記録し、累計をすぐ確認します。",
      useTitle: "When to use",
      useBody: "Use right after payment to log real spend.",
      diffTitle: "Difference from Daily budget",
      diffBody: "Daily budget sets a baseline before the day. Spend log tracks real spending during the day.",
      tracker: "実支出トラッカー",
      quick: "為替クイックチェック",
      a1: "Plan 予算ページ",
      a2: "Olive Young予算",
    };
  }
  if (lang === "zh-cn") {
    return {
      title: "支出记录",
      lead: "记录旅途中实际花费，并立即查看累计金额。",
      useTitle: "When to use",
      useBody: "Use right after payment to log real spend.",
      diffTitle: "Difference from Daily budget",
      diffBody: "Daily budget sets a baseline before the day. Spend log tracks real spending during the day.",
      tracker: "实际支出记录",
      quick: "汇率快速换算",
      a1: "Plan 预算页",
      a2: "Olive Young预算",
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      title: "支出紀錄",
      lead: "記錄旅途中實際花費，並立即查看累計金額。",
      useTitle: "When to use",
      useBody: "Use right after payment to log real spend.",
      diffTitle: "Difference from Daily budget",
      diffBody: "Daily budget sets a baseline before the day. Spend log tracks real spending during the day.",
      tracker: "實際支出紀錄",
      quick: "匯率快速換算",
      a1: "Plan 預算頁",
      a2: "Olive Young預算",
    };
  }
  return {
    title: "Spend log",
    lead: "Log real spend as you move. Keep running totals and use quick conversion when needed.",
    useTitle: "When to use",
    useBody: "Use right after payment to log real spend.",
    diffTitle: "Difference from Daily budget",
    diffBody: "Daily budget sets a baseline before the day. Spend log tracks real spending during the day.",
    tracker: "Real spend tracker",
    quick: "Quick exchange check",
    a1: "Plan budget page",
    a2: "Olive Young budget",
  };
}

export default async function NowSpendLogPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const locale = lang as Lang;
  const c = copy(locale);

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">{c.title}</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-700">{c.lead}</p>
      <section className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-700">{c.useTitle}</p>
        <p className="mt-2 text-sm leading-6 text-zinc-700">{c.useBody}</p>
        <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-zinc-700">{c.diffTitle}</p>
        <p className="mt-2 text-sm leading-6 text-zinc-700">{c.diffBody}</p>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">{c.tracker}</h2>
        <div className="mt-4">
          <ExpenseTracker lang={locale} readOnlyBudget />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">{c.quick}</h2>
        <div className="mt-4">
          <TravelCalculator lang={locale} mode="now" showHeader={false} />
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
        <Link href={`/${locale}/plan/daily-budget`} className="rounded-full border border-zinc-900 px-4 py-2 text-zinc-900">{c.a1}</Link>
        <Link href={`/${locale}/plan/olive-young`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">{c.a2}</Link>
      </div>
    </Container>
  );
}
