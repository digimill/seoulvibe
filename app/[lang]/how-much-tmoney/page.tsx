import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { isLang, type Lang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

function copy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "티머니 얼마 충전하면 될까?",
      lead: "완벽한 계산보다, 중간에 안 끊기는 잔액이 중요합니다.",
      triad: ["자주 꼬이는 지점", "왜 생기나", "지금 할 일"],
      a1: "환승 중 잔액 부족, 밤 이동 전 잔액 바닥",
      a2: "처음에 너무 적게 충전하고 체크를 안 함",
      a3: "체류 기간 기준으로 충전하고 최소 잔액을 유지",
      stepsTitle: "빠른 기준",
      steps: ["1~2일: 1.5~2만원", "3~4일: 2.5~3.5만원", "5~7일: 4~5.5만원", "최소 잔액 7천~1만원 유지"],
      link: "지하철 방향 빠른 해결",
    };
  }
  if (lang === "ja") {
    return {
      title: "T-moneyはいくらチャージする？",
      lead: "完璧な計算より、途中で止まらない残高が大事。",
      triad: ["よく詰まる点", "なぜ起きる", "今やること"],
      a1: "乗換中の残高不足、夜移動前に残高切れ",
      a2: "初回チャージが少なすぎて確認を忘れる",
      a3: "滞在日数で入れて最低残高を維持",
      stepsTitle: "目安",
      steps: ["1-2日: 15,000-20,000ウォン", "3-4日: 25,000-35,000ウォン", "5-7日: 40,000-55,000ウォン", "最低7,000-10,000ウォン維持"],
      link: "地下鉄方向の即対応",
    };
  }
  if (lang === "zh-cn") {
    return {
      title: "T-money 该充多少？",
      lead: "不用算到很精确，关键是别在中途断余额。",
      triad: ["常见问题", "为什么会这样", "现在怎么做"],
      a1: "换乘时余额不足，晚间出行前见底",
      a2: "首充太少，后续又没检查",
      a3: "按停留天数充值并保留最低余额",
      stepsTitle: "快速标准",
      steps: ["1-2天：1.5万-2万韩元", "3-4天：2.5万-3.5万韩元", "5-7天：4万-5.5万韩元", "最低保留7000-1万韩元"],
      link: "地铁方向速解",
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      title: "T-money 要儲多少？",
      lead: "不用算得很精準，重點是不要中途沒錢。",
      triad: ["常見卡點", "為什麼會發生", "現在先做"],
      a1: "轉乘時餘額不足，晚間移動前見底",
      a2: "一開始儲值太少，後面又沒檢查",
      a3: "按停留天數儲值並保留最低餘額",
      stepsTitle: "快速基準",
      steps: ["1-2天：1.5萬-2萬韓元", "3-4天：2.5萬-3.5萬韓元", "5-7天：4萬-5.5萬韓元", "最低保留7000-1萬韓元"],
      link: "地鐵方向速解",
    };
  }
  return {
    title: "How Much T-money Should You Load?",
    lead: "You do not need perfect math. You need enough balance to keep moving.",
    triad: ["What goes wrong", "Why", "Do this now"],
    a1: "Balance dies during transfers or before night moves",
    a2: "People under-load at start and forget to check",
    a3: "Load by stay length and keep a minimum floor",
    stepsTitle: "Quick baseline",
    steps: ["1-2 days: KRW 15,000-20,000", "3-4 days: KRW 25,000-35,000", "5-7 days: KRW 40,000-55,000", "Keep KRW 7,000-10,000 minimum"],
    link: "Subway direction quick fix",
  };
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const locale = lang as Lang;
  const c = copy(locale);

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
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-900 sm:text-base">{c.steps.map((s)=><li key={s}>- {s}</li>)}</ul>
      </section>

      <section className="mt-6 text-sm font-semibold text-zinc-700">
        <Link href={`/${locale}/tips/subway-map-confusion-cuts`} className="underline">{c.link}</Link>
      </section>
    </Container>
  );
}
