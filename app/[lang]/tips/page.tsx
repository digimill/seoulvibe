import { notFound } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionBlock } from "@/components/SectionBlock";
import { TagBadge } from "@/components/TagBadge";
import { getTips } from "@/lib/content";
import { isLang, type Lang } from "@/lib/i18n";
import { getProblemQuestion, problemSeoItems } from "@/lib/problem-seo";

type TipsPageProps = {
  params: Promise<{ lang: string }>;
};

const PRIORITY_IDS = ["kiosk-survival-flow", "subway-map-confusion-cuts", "oliveyoung-master-playbook"];

export default async function TipsPage({ params }: TipsPageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const tips = await getTips(locale);
  const copy =
    locale === "ko"
      ? { title: "문제 해결 가이드", desc: "뭐가 꼬이는지, 왜 꼬이는지, 지금 뭘 해야 하는지 바로 확인.", qTitle: "문제 리스트 (20)", cta: "지금 해결하기" }
      : locale === "ja"
        ? { title: "トラブル解決ガイド", desc: "何が詰まりやすいか、なぜ起きるか、今どう動くかを即確認。", qTitle: "問題リスト（20）", cta: "今すぐ解決" }
        : locale === "zh-cn"
          ? { title: "问题速解指南", desc: "先看哪里会出错、为什么会出错、现在该怎么做。", qTitle: "问题列表（20）", cta: "立即处理" }
          : locale === "zh-tw" || locale === "zh-hk"
            ? { title: "問題速解指南", desc: "先看哪裡會出錯、為什麼會出錯、現在該怎麼做。", qTitle: "問題列表（20）", cta: "立即處理" }
            : { title: "Solve problems fast", desc: "What usually goes wrong, why it happens, and what to do now.", qTitle: "Problem list (20)", cta: "Fix this now" };
  const crowdCard =
    locale === "ko"
      ? {
          title: "혼잡 탈출",
          description: "사람 너무 많으면 버티지 말고 바로 빠져나오세요. 지역별 우회 동선을 바로 확인합니다.",
          image: { src: "/images/tips/popup-radar-weekly.jpg", alt: "Crowded Seoul street at night" },
        }
      : locale === "ja"
        ? {
            title: "混雑から離脱",
            description: "人が多すぎる時は粘らず離脱。エリア別の回避ルートをすぐ確認。",
            image: { src: "/images/tips/popup-radar-weekly.jpg", alt: "Crowded Seoul street at night" },
          }
        : locale === "zh-cn"
          ? {
              title: "拥挤脱离",
              description: "人太多就别硬撑，先撤离。按区域快速查看绕行路线。",
              image: { src: "/images/tips/popup-radar-weekly.jpg", alt: "Crowded Seoul street at night" },
            }
          : locale === "zh-tw" || locale === "zh-hk"
            ? {
                title: "擁擠脫離",
                description: "人太多先離開，不要硬撐。按區域快速看避開路線。",
                image: { src: "/images/tips/popup-radar-weekly.jpg", alt: "Crowded Seoul street at night" },
              }
            : {
                title: "Escape crowds fast",
                description: "If it is packed, do not force it. Check quick area-by-area exits now.",
                image: { src: "/images/tips/popup-radar-weekly.jpg", alt: "Crowded Seoul street at night" },
              };
  const sorted = [...tips].sort((a, b) => {
    const ai = PRIORITY_IDS.indexOf(a.id);
    const bi = PRIORITY_IDS.indexOf(b.id);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return (
    <SectionBlock title={copy.title} description={copy.desc}>
      <div className="mb-5">
        <Card
          href={`/${locale}/crowded`}
          title={crowdCard.title}
          description={crowdCard.description}
          image={crowdCard.image}
          imageRatio="3 / 2"
          ctaLabel={copy.cta}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((tip) => (
          <Card
            key={tip.id}
            href={`/${locale}/tips/${tip.id}`}
            title={tip.title}
            description={tip.summary}
            image={tip.image}
            imageRatio="3 / 2"
            ctaLabel={copy.cta}
            footer={tip.tags.map((tag) => (
              <TagBadge key={tag}>{tag}</TagBadge>
            ))}
          />
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-zinc-200 bg-white p-5 sm:p-7" id="problem-list">
        <h3 className="text-xl font-black tracking-tight text-zinc-950">{copy.qTitle}</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {problemSeoItems.map((item) => (
            <Link
              key={item.slug}
              href={`/${locale}/problems/${item.slug}`}
              className="rounded-2xl border border-zinc-300 p-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              {getProblemQuestion(item, locale)}
            </Link>
          ))}
        </div>
      </div>
    </SectionBlock>
  );
}
