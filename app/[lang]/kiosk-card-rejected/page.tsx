import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { isLang, type Lang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

function t(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "서울 키오스크 카드 오류: 60초 해결",
      lead: "키오스크에서 카드가 막히는 건 매우 흔합니다. 은행 문제가 아니라 단말/흐름 문제인 경우가 대부분입니다.",
      triad: ["자주 망가지는 지점", "왜 생기나", "지금 바로 할 일"],
      a1: "삽입 결제 실패, 영어 버튼 없음, 전화번호 입력 화면에서 멈춤",
      a2: "매장별 단말기 차이 + 멤버십 UI + 피크타임 압박",
      a3: "탭 결제 -> 다른 카드 -> 카운터 결제 요청 순서로 이동",
      stepsTitle: "현장 순서",
      steps: ["탭 결제를 먼저 시도", "같은 화면 반복 금지", "다른 카드 1회 시도", "직원에게 카운터 결제 요청"],
      link: "키오스크 빠른 해결 페이지",
    };
  }
  return {
    title: "Card Rejected at Seoul Kiosk: 60-Second Fix",
    lead: "Kiosk card failure is common in Seoul. It is usually a terminal flow issue, not a bank issue.",
    triad: ["What goes wrong", "Why", "Do this now"],
    a1: "Insert fails, no English option, phone prompt blocks checkout",
    a2: "Terminal differences + membership UI + queue pressure",
    a3: "Tap first -> switch card -> ask for counter payment",
    stepsTitle: "Field sequence",
    steps: ["Try tap before insert", "Do not loop on same screen", "Switch card once", "Ask staff for counter payment"],
    link: "Kiosk quick fix page",
  };
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const locale = lang as Lang;
  const c = t(locale);

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl">{c.title}</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">{c.lead}</p>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-zinc-200 bg-white p-5"><h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">{c.triad[0]}</h2><p className="mt-3 text-sm leading-6 text-zinc-800">{c.a1}</p></article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5"><h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">{c.triad[1]}</h2><p className="mt-3 text-sm leading-6 text-zinc-800">{c.a2}</p></article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5"><h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">{c.triad[2]}</h2><p className="mt-3 text-sm leading-6 text-zinc-800">{c.a3}</p></article>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">{c.stepsTitle}</h2>
        <ol className="mt-3 space-y-2 text-sm font-semibold text-zinc-900 sm:text-base">
          {c.steps.map((s, i) => (<li key={s}>{i + 1}. {s}</li>))}
        </ol>
      </section>

      <section className="mt-6 text-sm font-semibold text-zinc-700">
        <Link href={`/${locale}/tips/kiosk-survival-flow`} className="underline">{c.link}</Link>
      </section>
    </Container>
  );
}
