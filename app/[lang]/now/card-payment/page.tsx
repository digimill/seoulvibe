import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { isLang, type Lang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

function copy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "카드 결제",
      lead: "탭 먼저, 카드 1회 교체, 카운터 결제 요청 순서가 가장 빠릅니다.",
      seq: "즉시 실행 순서",
      steps: [
        "탭 결제를 먼저 시도합니다.",
        "같은 화면에서 반복 시도하지 않습니다.",
        "백업 카드 1회를 시도합니다.",
        "직원에게 카운터 결제를 요청합니다.",
      ],
      a1: "결제 가이드 열기",
      a2: "키오스크 오류 페이지",
      a3: "환율 + 예산 빠른 확인",
      a4: "지금 지출 로그 기록",
      a5: "올리브영 예산",
    };
  }
  return {
    title: "Card payment",
    lead: "Use backup logic: tap first, switch card once, then ask for counter payment.",
    seq: "Immediate sequence",
    steps: [
      "Try contactless (tap) before insert.",
      "Do not loop on the same screen repeatedly.",
      "Try one backup card.",
      "Ask staff for counter payment.",
    ],
    a1: "Open payment guide",
    a2: "Kiosk error page",
    a3: "Quick exchange and budget check",
    a4: "Log real spending now",
    a5: "Olive Young budget",
  };
}

export default async function NowCardPaymentPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const locale = lang as Lang;
  const c = copy(locale);

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">{c.title}</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-700">{c.lead}</p>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">{c.seq}</h2>
        <ol className="mt-3 space-y-2 text-sm font-semibold text-zinc-800">
          {c.steps.map((item, index) => <li key={item}>{index + 1}. {item}</li>)}
        </ol>
      </section>

      <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
        <Link href={`/${locale}/tips/payment`} className="rounded-full border border-zinc-900 px-4 py-2 text-zinc-900">{c.a1}</Link>
        <Link href={`/${locale}/kiosk-card-rejected`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">{c.a2}</Link>
        <Link href={`/${locale}/plan/daily-budget`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">{c.a3}</Link>
        <Link href={`/${locale}/now/spend-log`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">{c.a4}</Link>
        <Link href={`/${locale}/plan/daily-budget#olive-young-budget`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">{c.a5}</Link>
      </div>
    </Container>
  );
}
