import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { isLang, type Lang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

function copy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "키오스크",
      lead: "지금 어떤 문제가 생겼나요?",
      stuckTitle: "지금 막혔어요",
      cards: [
        { href: "card-rejected", title: "카드 거절", desc: "카드 거절 시 60초 순서 해결" },
        { href: "no-english", title: "영어 옵션 없음", desc: "LANG 버튼이 안 보일 때" },
        { href: "phone-number", title: "전화번호 입력 화면", desc: "멤버십 화면에서 막힐 때" },
        { href: "frozen-timeout", title: "화면 멈춤", desc: "멈춤/타임아웃 대응" },
      ],
      practiceTitle: "먼저 연습해볼까요?",
      practiceDesc: "실전 전에 2분만 연습하면 실수 확률을 낮출 수 있습니다.",
      practiceCta: "키오스크 시뮬레이션 시작",
    };
  }
  if (lang === "ja") {
    return {
      title: "キオスク",
      lead: "今、どこで詰まっていますか？",
      stuckTitle: "今すぐ解決",
      cards: [
        { href: "card-rejected", title: "カード拒否", desc: "カード拒否を60秒順で解決" },
        { href: "no-english", title: "英語表示なし", desc: "LANGボタンが見当たらない時" },
        { href: "phone-number", title: "電話番号入力画面", desc: "会員画面で止まる時" },
        { href: "frozen-timeout", title: "画面フリーズ", desc: "フリーズ/タイムアウト対応" },
      ],
      practiceTitle: "先に練習しますか？",
      practiceDesc: "実戦前に2分だけ練習すると失敗を減らせます。",
      practiceCta: "キオスク練習を始める",
    };
  }
  if (lang === "zh-cn") {
    return {
      title: "点餐机",
      lead: "你现在卡在哪一步？",
      stuckTitle: "我现在卡住了",
      cards: [
        { href: "card-rejected", title: "刷卡失败", desc: "60秒顺序处理刷卡失败" },
        { href: "no-english", title: "没有英文选项", desc: "找不到LANG按钮时" },
        { href: "phone-number", title: "要求输入手机号", desc: "卡在会员/手机号页面时" },
        { href: "frozen-timeout", title: "屏幕卡住", desc: "屏幕卡住/超时处理" },
      ],
      practiceTitle: "要先练习吗？",
      practiceDesc: "先练2分钟，可明显减少现场失误。",
      practiceCta: "开始点餐机模拟",
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      title: "點餐機",
      lead: "你現在卡在哪一步？",
      stuckTitle: "我現在卡住了",
      cards: [
        { href: "card-rejected", title: "刷卡失敗", desc: "60秒順序處理刷卡失敗" },
        { href: "no-english", title: "沒有英文選項", desc: "找不到LANG按鈕時" },
        { href: "phone-number", title: "要求輸入手機號", desc: "卡在會員/手機號頁面時" },
        { href: "frozen-timeout", title: "畫面卡住", desc: "螢幕卡住/逾時處理" },
      ],
      practiceTitle: "要先練習嗎？",
      practiceDesc: "先練2分鐘，可明顯減少現場失誤。",
      practiceCta: "開始點餐機模擬",
    };
  }

  return {
    title: "Kiosk",
    lead: "What’s happening right now?",
    stuckTitle: "I’m stuck right now",
    cards: [
      { href: "card-rejected", title: "Card rejected", desc: "60-second recovery sequence" },
      { href: "no-english", title: "No English option", desc: "When LANG is hard to find" },
      { href: "phone-number", title: "Asking for phone number", desc: "When membership screen blocks payment" },
      { href: "frozen-timeout", title: "Screen stuck", desc: "Frozen screen and timeout response" },
    ],
    practiceTitle: "Want to practice first?",
    practiceDesc: "A 2-minute run can reduce real kiosk mistakes.",
    practiceCta: "Try kiosk simulation",
  };
}

export default async function NowKioskPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const locale = lang as Lang;
  const c = copy(locale);

  return (
    <Container className="py-10 sm:py-14">
      <section className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{c.title}</h1>
        <p className="mt-3 text-sm font-semibold text-zinc-300">{c.lead}</p>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">{c.stuckTitle}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {c.cards.map((card) => (
            <Link
              key={card.href}
              href={`/${locale}/now/kiosk/${card.href}`}
              className="rounded-xl border border-zinc-300 bg-zinc-50 p-4 transition hover:border-zinc-900"
            >
              <p className="text-base font-black text-zinc-950">{card.title}</p>
              <p className="mt-1 text-sm font-semibold text-zinc-700">{card.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">{c.practiceTitle}</h2>
        <p className="mt-2 text-sm font-semibold text-zinc-700">{c.practiceDesc}</p>
        <div className="mt-4">
          <Link href={`/${locale}/tools/kiosk-practice`} className="inline-flex rounded-full border border-zinc-900 px-4 py-2 text-sm font-black text-zinc-900">
            {c.practiceCta}
          </Link>
        </div>
      </section>
    </Container>
  );
}
