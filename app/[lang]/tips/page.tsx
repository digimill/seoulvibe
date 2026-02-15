import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { SectionBlock } from "@/components/SectionBlock";
import { TagBadge } from "@/components/TagBadge";
import { getTips } from "@/lib/content";
import { isLang, type Lang } from "@/lib/i18n";

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
      ? { title: "문제 해결 가이드", desc: "뭐가 꼬이는지, 왜 꼬이는지, 지금 뭘 해야 하는지 바로 확인." }
      : locale === "ja"
        ? { title: "トラブル解決ガイド", desc: "何が詰まりやすいか、なぜ起きるか、今どう動くかを即確認。" }
        : locale === "zh-cn"
          ? { title: "问题速解指南", desc: "先看哪里会出错、为什么会出错、现在该怎么做。" }
          : locale === "zh-tw" || locale === "zh-hk"
            ? { title: "問題速解指南", desc: "先看哪裡會出錯、為什麼會出錯、現在該怎麼做。" }
            : { title: "Solve problems fast", desc: "What usually goes wrong, why it happens, and what to do now." };
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((tip) => (
          <Card
            key={tip.id}
            href={`/${locale}/tips/${tip.id}`}
            title={tip.title}
            description={tip.summary}
            image={tip.image}
            footer={tip.tags.map((tag) => (
              <TagBadge key={tag}>{tag}</TagBadge>
            ))}
          />
        ))}
      </div>
    </SectionBlock>
  );
}
