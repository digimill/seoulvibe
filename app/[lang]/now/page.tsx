import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/Container";
import { isLang, type Lang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

function nowCardImage(href: string) {
  switch (href) {
    case "kiosk":
      return "/images/now-cards/now-card-kiosk.png";
    case "card-payment":
      return "/images/now-cards/now-card-card-payment.png";
    case "subway-help":
      return "/images/now-cards/now-card-subway-help.png";
    case "t-money":
      return "/images/now-cards/now-card-t-money.png";
    case "crowd-escape":
      return "/images/now-cards/now-card-crowd-escape.png";
    case "internet-down":
      return "/images/now-cards/now-card-internet-down.png";
    case "need-pharmacy":
      return "/images/now-cards/now-card-need-pharmacy.png";
    default:
      return "";
  }
}

function nowCardHref(lang: Lang, href: string) {
  if (href === "internet-down") return `/${lang}/tips/sim-wifi`;
  if (href === "need-pharmacy") return `/${lang}/tips/pharmacy-hospital-emergency`;
  return `/${lang}/now/${href}`;
}

function copy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "Now: 여행 중 즉시 해결",
      lead: "지금 막힌 상황부터 바로 고르세요.",
      badge: "CURATED NOW",
      cards: [
        { href: "card-payment", title: "Payment failed", desc: "카드 결제가 안 될 때" },
        { href: "kiosk", title: "Kiosk stuck", desc: "키오스크에서 막혔을 때" },
        { href: "subway-help", title: "Lost in subway", desc: "지하철에서 헷갈릴 때" },
        { href: "internet-down", title: "Internet down", desc: "데이터가 안 될 때" },
        { href: "crowd-escape", title: "Too crowded", desc: "사람이 너무 많을 때" },
        { href: "need-pharmacy", title: "Need pharmacy", desc: "아프거나 다쳤을 때" },
      ],
      quickTitle: "Travel Utilities",
      quickTmoney: "티머니 빠른 확인",
      quickBudget: "환율 + 일일 예산",
      quickOlive: "올리브영 예산",
      quickSpend: "지출 로그",
    };
  }
  if (lang === "ja") {
    return {
      title: "Now: 旅行中の即時解決",
      lead: "今すぐ困っている状況を解くための代表6テーマだけを厳選。",
      badge: "CURATED NOW",
      cards: [
        { href: "kiosk", title: "Kiosk", desc: "キオスク注文/決済の詰まり" },
        { href: "card-payment", title: "Card payment", desc: "カード決済失敗の対応" },
        { href: "subway-help", title: "Subway help", desc: "路線/方向/乗換の混乱" },
        { href: "t-money", title: "T-money", desc: "残高/チャージ計算" },
        { href: "crowd-escape", title: "Crowd escape", desc: "混雑エリアからの離脱" },
        { href: "spend-log", title: "Spend log", desc: "実支出を記録して合計確認" },
      ],
      quickTitle: "Travel Utilities",
      quickTmoney: "T-money クイックチェック",
      quickBudget: "為替 + 日次予算",
      quickOlive: "Olive Young予算",
      quickSpend: "Spend log",
    };
  }
  if (lang === "zh-cn") {
    return {
      title: "Now：旅途中即时解决",
      lead: "只保留旅途中最常见的 6 个即时问题，直接进入处理。",
      badge: "CURATED NOW",
      cards: [
        { href: "kiosk", title: "Kiosk", desc: "点餐机下单/支付卡住" },
        { href: "card-payment", title: "Card payment", desc: "刷卡失败处理" },
        { href: "subway-help", title: "Subway help", desc: "线路/方向/换乘混乱" },
        { href: "t-money", title: "T-money", desc: "余额/充值计算" },
        { href: "crowd-escape", title: "Crowd escape", desc: "快速离开拥挤区域" },
        { href: "spend-log", title: "Spend log", desc: "记录实际花费并看合计" },
      ],
      quickTitle: "Travel Utilities",
      quickTmoney: "T-money 快速检查",
      quickBudget: "汇率 + 每日预算",
      quickOlive: "Olive Young预算",
      quickSpend: "Spend log",
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      title: "Now：旅途中即時解決",
      lead: "只保留旅途中最常見的 6 個即時問題，直接進入處理。",
      badge: "CURATED NOW",
      cards: [
        { href: "kiosk", title: "Kiosk", desc: "點餐機下單/支付卡住" },
        { href: "card-payment", title: "Card payment", desc: "刷卡失敗處理" },
        { href: "subway-help", title: "Subway help", desc: "路線/方向/轉乘混亂" },
        { href: "t-money", title: "T-money", desc: "餘額/儲值計算" },
        { href: "crowd-escape", title: "Crowd escape", desc: "快速離開擁擠區域" },
        { href: "spend-log", title: "Spend log", desc: "記錄實際花費並看總計" },
      ],
      quickTitle: "Travel Utilities",
      quickTmoney: "T-money 快速檢查",
      quickBudget: "匯率 + 每日預算",
      quickOlive: "Olive Young預算",
      quickSpend: "Spend log",
    };
  }

  return {
    title: "Now: Live problem solving",
    lead: "A curated set of 6 urgent situations for immediate action.",
    badge: "CURATED NOW",
    cards: [
      { href: "kiosk", title: "Kiosk", desc: "Ordering and payment blockage at kiosk" },
      { href: "card-payment", title: "Card payment", desc: "Card declined and fallback flow" },
      { href: "subway-help", title: "Subway help", desc: "Line, direction, and transfer confusion" },
      { href: "t-money", title: "T-money", desc: "Balance and top-up planning" },
      { href: "crowd-escape", title: "Crowd escape", desc: "Fast exits from packed zones" },
      { href: "spend-log", title: "Spend log", desc: "Track real spending and running totals" },
    ],
    quickTitle: "Travel Utilities",
    quickTmoney: "T-money quick check",
    quickBudget: "Exchange + daily budget",
    quickOlive: "Olive Young budget",
    quickSpend: "Spend log",
  };
}

export default async function NowPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const locale = lang as Lang;
  const c = copy(locale);

  return (
    <Container className="py-10 sm:py-14">
      <section className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <p className="inline-flex rounded-full border border-zinc-700 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-300">{c.badge}</p>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{c.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">{c.lead}</p>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {c.cards.map((card) => (
          <Link key={card.href} href={nowCardHref(locale, card.href)} className="rounded-2xl border-2 border-zinc-900 bg-white p-4 shadow-[0_8px_0_0_rgba(24,24,27,0.95)] transition hover:-translate-y-0.5">
            <div className="flex items-center gap-4">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden">
                <Image
                  src={nowCardImage(card.href)}
                  alt=""
                  fill
                  sizes="96px"
                  unoptimized
                  className="object-contain [clip-path:inset(2px)]"
                />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-zinc-950">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-700">{card.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">{c.quickTitle}</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
          <Link href={`/${locale}/now/t-money`} className="rounded-full border border-zinc-900 px-4 py-2 text-zinc-900">
            {c.quickTmoney}
          </Link>
          <Link href={`/${locale}/plan/daily-budget`} className="rounded-full border border-zinc-900 px-4 py-2 text-zinc-900">
            {c.quickBudget}
          </Link>
          <Link href={`/${locale}/plan/olive-young`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">
            {c.quickOlive}
          </Link>
          <Link href={`/${locale}/now/spend-log`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">
            {c.quickSpend}
          </Link>
        </div>
      </section>
    </Container>
  );
}
