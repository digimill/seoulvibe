import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { isLang, type Lang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

function copy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "공항에서 시내 이동",
      lead: "도착 시간, 짐, 환승 허용 범위를 기준으로 선택하세요.",
      railTitle: "AREX / 철도",
      railDesc: "환승 0~1회를 감수할 수 있고, 시간 예측이 중요할 때 적합합니다.",
      busTitle: "공항버스",
      busDesc: "짐이 많고 숙소 근처 하차가 필요할 때 가장 단순합니다.",
      taxiTitle: "택시",
      taxiDesc: "심야 도착이거나 동행 인원이 있어 이동을 단순화할 때 적합합니다.",
      cta: "상세 가이드 열기",
    };
  }
  if (lang === "ja") {
    return {
      title: "空港から市内へ",
      lead: "到着時刻、荷物、乗換許容度で選びましょう。",
      railTitle: "AREX / 鉄道",
      railDesc: "乗換0〜1回で、到着時刻の安定性を重視する場合に最適です。",
      busTitle: "空港バス",
      busDesc: "荷物が多く、ホテル近くで降りたい場合に最もシンプルです。",
      taxiTitle: "タクシー",
      taxiDesc: "深夜到着やグループ移動で、手間を減らしたい時に適しています。",
      cta: "詳細ガイドを開く",
    };
  }
  if (lang === "zh-cn") {
    return {
      title: "机场到市区",
      lead: "根据到达时间、行李和可接受换乘次数来选择。",
      railTitle: "AREX / 铁路",
      railDesc: "可接受0~1次换乘，且更看重时间稳定性时最合适。",
      busTitle: "机场巴士",
      busDesc: "行李较多且希望在酒店附近下车时最省事。",
      taxiTitle: "出租车",
      taxiDesc: "适合深夜到达或多人同行、希望流程更简单的情况。",
      cta: "打开详细指南",
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      title: "機場到市區",
      lead: "依到達時間、行李與可接受轉乘次數來選擇。",
      railTitle: "AREX / 鐵路",
      railDesc: "可接受0~1次轉乘，且重視時間穩定性時最適合。",
      busTitle: "機場巴士",
      busDesc: "行李較多且希望在飯店附近下車時最省事。",
      taxiTitle: "計程車",
      taxiDesc: "適合深夜到達或多人同行、希望流程更簡單的情況。",
      cta: "開啟詳細指南",
    };
  }
  return {
    title: "Airport to city",
    lead: "Pick based on arrival time, luggage, and transfer tolerance.",
    railTitle: "AREX / Rail",
    railDesc: "Best when you can handle 0-1 transfer and want stable timing.",
    busTitle: "Airport Bus",
    busDesc: "Best for heavy luggage and simple drop-off near hotel district.",
    taxiTitle: "Taxi",
    taxiDesc: "Best for late-night arrivals or tight group logistics.",
    cta: "Open detailed guide",
  };
}

export default async function AirportToCityPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const locale = lang as Lang;
  const c = copy(locale);

  return (
    <Container className="py-10 sm:py-14">
      <section className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{c.title}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">{c.lead}</p>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-black text-zinc-950">{c.railTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-700">{c.railDesc}</p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-black text-zinc-950">{c.busTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-700">{c.busDesc}</p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-black text-zinc-950">{c.taxiTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-700">{c.taxiDesc}</p>
        </article>
      </section>

      <div className="mt-6 text-sm font-semibold">
        <Link href={`/${locale}/tips/airport-to-city`} className="rounded-full border border-zinc-900 px-4 py-2 text-zinc-900">{c.cta}</Link>
      </div>
    </Container>
  );
}
