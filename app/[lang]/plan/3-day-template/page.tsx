import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { isLang, type Lang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

function copy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "3일 템플릿",
      lead: "한강을 하루에 여러 번 넘지 마세요. 강의 양쪽 기준으로 동선을 잡으면 이동 손실이 줄어듭니다.",
      days: [
        {
          title: "Day 1",
          body: "도착 + 숙소 체크인 + 숙소 근처 짧은 저녁 동선 1개.",
          example: "예: 홍대 숙소라면 연남 야간 산책으로 마무리.",
        },
        {
          title: "Day 2",
          body: "메인 탐색일. 낮에는 앵커 지역 1곳만 고정하고 밤 블록은 선택.",
          example: "앵커 예시: 성수 또는 북촌 또는 강남.",
        },
        {
          title: "Day 3",
          body: "출국 동선 근처의 저위험 루트. 환승 복잡도 최소화.",
          example: "ICN 출국이면 서측 위주로 두고 동-서 러시아워 횡단은 피하기.",
        },
      ],
      cta1: "숙소 위치 매칭",
      cta2: "지역 비교하기",
    };
  }
  if (lang === "ja") {
    return {
      title: "3日テンプレート",
      lead: "漢江の往復を1日に何度もしないこと。川の東西で動線を組むと移動ロスが減ります。",
      days: [
        {
          title: "Day 1",
          body: "到着 + 宿のセットアップ + 宿近くの短い夜エリア1つ。",
          example: "例: 弘大に泊まるなら夜は延南を短く回る。",
        },
        {
          title: "Day 2",
          body: "メイン探索日。昼はアンカー地区を1つ固定し、夜ブロックは任意。",
          example: "アンカー例: 聖水 / 北村 / 江南。",
        },
        {
          title: "Day 3",
          body: "出発回廊に近い低リスクルート。乗換の複雑さを下げる。",
          example: "ICN出発なら西側中心。東西横断のラッシュは回避。",
        },
      ],
      cta1: "宿の場所をマッチ",
      cta2: "エリア比較",
    };
  }
  if (lang === "zh-cn") {
    return {
      title: "3天模板",
      lead: "一天内尽量不要多次跨汉江。按江南/江西两侧规划，能明显减少通勤损耗。",
      days: [
        {
          title: "Day 1",
          body: "到达 + 落脚 + 酒店附近短晚间动线1条。",
          example: "例: 住弘大，晚间走延南短线。",
        },
        {
          title: "Day 2",
          body: "主探索日。白天只定1个锚点区域，夜间模块可选。",
          example: "锚点示例: 圣水 / 北村 / 江南。",
        },
        {
          title: "Day 3",
          body: "靠近离境走廊的低风险路线，降低换乘复杂度。",
          example: "若飞ICN，优先西侧，避免高峰东西横穿。",
        },
      ],
      cta1: "匹配住宿位置",
      cta2: "比较区域",
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      title: "3天模板",
      lead: "一天內盡量不要多次跨漢江。按江南/江西兩側規劃，可明顯降低移動損耗。",
      days: [
        {
          title: "Day 1",
          body: "抵達 + 安置住宿 + 住處附近短晚間動線1條。",
          example: "例: 住弘大，晚上走延南短線。",
        },
        {
          title: "Day 2",
          body: "主探索日。白天只定1個錨點區域，夜間區塊可選。",
          example: "錨點示例: 聖水 / 北村 / 江南。",
        },
        {
          title: "Day 3",
          body: "靠近離境走廊的低風險路線，降低轉乘複雜度。",
          example: "若飛ICN，優先西側，避免尖峰東西橫穿。",
        },
      ],
      cta1: "匹配住宿位置",
      cta2: "比較區域",
    };
  }

  return {
    title: "3-day template",
    lead: "Do not cross the Han River multiple times per day. Plan by side to cut transfer loss.",
    days: [
      {
        title: "Day 1",
        body: "Arrival + base setup + one short evening zone near your hotel.",
        example: "If staying in Hongdae, do a short Yeonnam evening walk.",
      },
      {
        title: "Day 2",
        body: "Main exploration day. Keep one anchor district in daytime and one optional night block.",
        example: "Pick one anchor: Seongsu OR Bukchon OR Gangnam.",
      },
      {
        title: "Day 3",
        body: "Low-risk route near departure corridor. Keep transfer complexity low.",
        example: "If departing ICN, stay west side and avoid east-west rush crossing.",
      },
    ],
    cta1: "Match your base",
    cta2: "Compare areas",
  };
}

export default async function ThreeDayTemplatePage({ params }: PageProps) {
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
        {c.days.map((day) => (
          <article key={day.title} className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">{day.title}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-700">{day.body}</p>
            <p className="mt-2 text-sm font-semibold text-zinc-900">{day.example}</p>
          </article>
        ))}
      </section>

      <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
        <Link href={`/${locale}/plan/where-to-stay`} className="rounded-full border border-zinc-900 px-4 py-2 text-zinc-900">{c.cta1}</Link>
        <Link href={`/${locale}/areas`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">{c.cta2}</Link>
      </div>
    </Container>
  );
}
