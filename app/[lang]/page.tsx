import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { isLang, type Lang } from "@/lib/i18n";

type HomePageProps = {
  params: Promise<{ lang: string }>;
};

type HomeCopy = {
  title: string;
  lead: string;
  ctaStay: string;
  ctaNow: string;
  ctaArea: string;
  stayDesc: string;
  nowDesc: string;
  areaDesc: string;
};

function getHomeCopy(lang: Lang): HomeCopy {
  if (lang === "ko") {
    return {
      title: "상황 먼저 선택하세요",
      lead: "Seoul Vibe는 정보 모음이 아니라 실수와 불안을 줄이는 인터랙티브 가이드입니다.",
      ctaStay: "Find where to stay",
      ctaNow: "Fix something now",
      ctaArea: "Explore by area",
      stayDesc: "숙소 위치를 5문항으로 매칭하고 바로 동네를 고릅니다.",
      nowDesc: "지하철/결제/키오스크/티머니 문제를 즉시 해결합니다.",
      areaDesc: "홍대·명동·강남·성수·이태원·잠실을 판단형으로 비교합니다.",
    };
  }
  if (lang === "ja") {
    return {
      title: "まず状況を選ぶ",
      lead: "Seoul Vibeは情報一覧ではなく、失敗と不安を減らすインタラクティブガイドです。",
      ctaStay: "滞在エリアを決める",
      ctaNow: "今すぐ解決する",
      ctaArea: "エリア比較を見る",
      stayDesc: "5問で滞在エリアをマッチングし、拠点を決めます。",
      nowDesc: "地下鉄・決済・キオスク・T-moneyを即対応します。",
      areaDesc: "ホンデ・明洞・江南・聖水・梨泰院・蚕室を判断型で比較します。",
    };
  }
  if (lang === "zh-cn") {
    return {
      title: "先选你的当下场景",
      lead: "Seoul Vibe不是信息集合，而是降低失误和不安的互动决策指南。",
      ctaStay: "先决定住哪里",
      ctaNow: "现在立刻解决",
      ctaArea: "按区域判断比较",
      stayDesc: "用5个问题匹配住宿区域，先定城市落脚点。",
      nowDesc: "即时处理地铁、支付、点餐机和T-money问题。",
      areaDesc: "比较弘大、明洞、江南、圣水、梨泰院、蚕室。",
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      title: "先選你現在的情境",
      lead: "Seoul Vibe不是資訊列表，而是降低失誤與不安的互動決策指南。",
      ctaStay: "先決定住哪裡",
      ctaNow: "現在立即解決",
      ctaArea: "按地區比較判斷",
      stayDesc: "用5個問題配對住宿區域，先定城市落腳點。",
      nowDesc: "即時處理地鐵、支付、點餐機與T-money問題。",
      areaDesc: "比較弘大、明洞、江南、聖水、梨泰院、蠶室。",
    };
  }

  return {
    title: "Pick your situation first",
    lead: "Seoul Vibe is an interactive decision guide for reducing travel mistakes and uncertainty.",
    ctaStay: "Find where to stay",
    ctaNow: "Fix something now",
    ctaArea: "Explore by area",
    stayDesc: "Match your stay location with 5 questions and decide your base.",
    nowDesc: "Resolve subway, card payment, kiosk, and T-money issues immediately.",
    areaDesc: "Compare Hongdae, Myeongdong, Gangnam, Seongsu, Itaewon, and Jamsil.",
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const copy = getHomeCopy(locale);

  return (
    <Container className="py-8 sm:py-12">
      <section className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-10">
        <h1 className="text-4xl font-black tracking-tight sm:text-6xl">{copy.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">{copy.lead}</p>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href={`/${locale}/plan/where-to-stay`} className="rounded-3xl border-2 border-zinc-900 bg-white p-5 shadow-[0_10px_0_0_rgba(24,24,27,0.95)] transition hover:-translate-y-0.5">
          <p className="text-xl font-extrabold tracking-tight text-zinc-950">{copy.ctaStay}</p>
          <p className="mt-2 text-sm font-semibold text-zinc-700">{copy.stayDesc}</p>
        </Link>
        <Link href={`/${locale}/now`} className="rounded-3xl border-2 border-zinc-900 bg-white p-5 shadow-[0_10px_0_0_rgba(24,24,27,0.95)] transition hover:-translate-y-0.5">
          <p className="text-xl font-extrabold tracking-tight text-zinc-950">{copy.ctaNow}</p>
          <p className="mt-2 text-sm font-semibold text-zinc-700">{copy.nowDesc}</p>
        </Link>
        <Link href={`/${locale}/areas`} className="rounded-3xl border-2 border-zinc-900 bg-white p-5 shadow-[0_10px_0_0_rgba(24,24,27,0.95)] transition hover:-translate-y-0.5">
          <p className="text-xl font-extrabold tracking-tight text-zinc-950">{copy.ctaArea}</p>
          <p className="mt-2 text-sm font-semibold text-zinc-700">{copy.areaDesc}</p>
        </Link>
      </section>
    </Container>
  );
}
