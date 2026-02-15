import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { getCopy, isLang, type Lang } from "@/lib/i18n";

type CrowdedPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function CrowdedPage({ params }: CrowdedPageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const t = getCopy(locale);
  const copy =
    locale === "ko"
      ? {
          title: "여기 너무 붐벼요",
          lead: "억지로 버티지 마세요. 바로 빠져나오면 됩니다.",
          now: "지금 바로 할 것",
          exits: "지역별 빠른 탈출",
          why: "왜 이렇게 붐비나",
          nowItems: ["메인 거리에서 2블록 벗어나기", "혼잡한 역 말고 옆 역으로 이동", "핫플은 평일 낮으로 미루기"],
          exitItems: [
            "홍대: 연남동 쪽으로 이동해서 먼저 식사",
            "성수: 첫 바이럴 카페 스킵, 서울숲 쪽으로 이동",
            "북촌: 삼청길로 우회하고 다음날 아침 재방문",
            "강남: 2호선 피크 시간 회피, 버스/택시 단거리 이동",
          ],
          whyText: "주말/저녁 피크 + 바이럴 스팟 동시 몰림 + 같은 출구 집중.",
        }
      : locale === "ja"
        ? {
            title: "ここ、人が多すぎる",
            lead: "無理に粘らない。すぐ離脱すればOK。",
            now: "今すぐやること",
            exits: "エリア別 退避ルート",
            why: "なぜ混むのか",
            nowItems: ["メイン通りから2ブロック外へ", "隣の駅に切り替える", "人気スポットは平日昼へ回す"],
            exitItems: [
              "ホンデ: ヨンナム側へ移動して先に食事",
              "ソンス: 先頭の人気カフェを飛ばし、ソウルの森側へ",
              "プクチョン: サムチョンギルへ退避して翌朝に再訪",
              "カンナム: 2号線ピーク回避、バス/短距離タクシー",
            ],
            whyText: "週末と夕方のピーク、人が同じ出口に集中するため。",
          }
        : locale === "zh-cn"
          ? {
              title: "这里太挤了",
              lead: "别硬撑，先脱离拥挤点。",
              now: "现在就做",
              exits: "分区域快速撤离",
              why: "为什么会这么挤",
              nowItems: ["离开主街 2 个街区", "换到旁边车站", "热门点改到工作日白天"],
              exitItems: [
                "弘大：先往延南洞方向走，先吃饭",
                "圣水：跳过第一家网红店，转去首尔林一带",
                "北村：先转到三清路，隔天早上再回来",
                "江南：避开 2 号线高峰，改公交或短程打车",
              ],
              whyText: "周末晚高峰 + 网红点集中 + 同一出口拥堵叠加。",
            }
          : locale === "zh-tw" || locale === "zh-hk"
            ? {
                title: "這裡太擠了",
                lead: "不要硬撐，先離開人潮點。",
                now: "現在先做",
                exits: "分區快速撤離",
                why: "為什麼這麼擠",
                nowItems: ["先離開主街 2 個街區", "改走旁邊車站", "熱門點改到平日白天"],
                exitItems: [
                  "弘大：先往延南洞方向走，先吃飯",
                  "聖水：先跳過第一家網紅店，改去首爾林一帶",
                  "北村：先轉去三清街，隔天早上再回來",
                  "江南：避開 2 號線高峰，改公車或短程計程車",
                ],
                whyText: "週末晚高峰、人潮集中在同一出口造成擁堵。",
              }
            : {
                title: "It's too crowded here",
                lead: "Do not force it. Exit first, reset second.",
                now: "Do this now",
                exits: "Fast exits by area",
                why: "Why it happens",
                nowItems: ["Walk 2 blocks off main street", "Switch to a side station", "Move hot spots to weekday daytime"],
                exitItems: [
                  "Hongdae: walk toward Yeonnam side and eat first",
                  "Seongsu: skip first viral cafe, move to Seoul Forest side",
                  "Bukchon: pivot to Samcheong-gil, return next morning",
                  "Gangnam: avoid Line 2 peak, use bus or short taxi hop",
                ],
                whyText: "Weekend rush + viral concentration + same exits at the same time.",
              };

  return (
    <Container className="py-10 sm:py-14">
      <Link href={`/${locale}`} className="text-sm font-semibold text-zinc-600">
        {t.back}
      </Link>

      <section className="mt-4 rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{copy.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
          {copy.lead}
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">{copy.now}</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-800">
          {copy.nowItems.map((item, index) => (
            <li key={item}>{index + 1}. {item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">{copy.exits}</h2>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-800">
          {copy.exitItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">{copy.why}</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-700">{copy.whyText}</p>
      </section>
    </Container>
  );
}
