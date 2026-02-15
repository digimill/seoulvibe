import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { isLang, type Lang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

function copy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "올리브영 30분 공략",
      lead: "트렌드 다 보지 말고, 기본 세트만 빠르게 가져가세요.",
      pack: "$50 스타터팩",
      list: ["클렌저", "토너", "시트마스크 번들", "립틴트"],
      skip: "이건 건너뛰기",
      skipList: ["10단계 루틴", "랜덤 유행템", "영문 라벨 없는 제품"],
      pay: "결제 전 체크",
      payList: ["택스리펀드 가능", "여권 필요", "주요 카드 사용 가능"],
      link: "올리브영 빠른 해결 페이지",
    };
  }
  if (lang === "ja") {
    return {
      title: "オリーブヤング30分攻略",
      lead: "流行を全部追わず、基本セットを先に確保。",
      pack: "$50スターターパック",
      list: ["クレンザー", "トナー", "シートマスクセット", "リップティント"],
      skip: "これはスキップ",
      skipList: ["10ステップルーティン", "ランダムな流行品", "英語表記なし商品"],
      pay: "会計前チェック",
      payList: ["タックスリファンド可", "パスポート必要", "主要カード利用可"],
      link: "オリーブヤング即対応ページ",
    };
  }
  if (lang === "zh-cn") {
    return {
      title: "Olive Young 30分钟速购",
      lead: "别全看趋势，先拿基础套装。",
      pack: "$50 入门组合",
      list: ["洁面", "化妆水", "面膜组合", "唇釉"],
      skip: "这些先跳过",
      skipList: ["10步护肤", "随机网红款", "无英文标签产品"],
      pay: "付款前确认",
      payList: ["可退税", "需要护照", "支持主流信用卡"],
      link: "Olive Young 速解页面",
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      title: "Olive Young 30分鐘速購",
      lead: "不用全看趨勢，先拿基本組合。",
      pack: "$50 入門組合",
      list: ["潔面", "化妝水", "面膜組合", "唇彩"],
      skip: "這些先跳過",
      skipList: ["10步驟保養", "隨機網紅品", "沒有英文標籤的產品"],
      pay: "付款前確認",
      payList: ["可退稅", "需要護照", "可刷主要信用卡"],
      link: "Olive Young 速解頁面",
    };
  }
  return {
    title: "If You Only Have 30 Minutes at Olive Young",
    lead: "Skip trend rabbit holes. Buy the basic set first.",
    pack: "$50 starter pack",
    list: ["Cleanser", "Toner", "Sheet mask bundle", "Lip tint"],
    skip: "Skip",
    skipList: ["10-step routines", "Random trending items", "Products without English label"],
    pay: "Before you pay",
    payList: ["Tax refund possible", "Passport required", "Major cards accepted"],
    link: "Olive Young quick fix page",
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

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">{c.pack}</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-900">{c.list.map((s)=><li key={s}>- {s}</li>)}</ul>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">{c.skip}</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-900">{c.skipList.map((s)=><li key={s}>- {s}</li>)}</ul>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">{c.pay}</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-900">{c.payList.map((s)=><li key={s}>- {s}</li>)}</ul>
      </section>

      <section className="mt-6 text-sm font-semibold text-zinc-700">
        <Link href={`/${locale}/tools/olive-budget`} className="underline">{c.link}</Link>
      </section>
    </Container>
  );
}
