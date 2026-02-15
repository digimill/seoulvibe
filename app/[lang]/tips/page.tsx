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
  const sorted = [...tips].sort((a, b) => {
    const ai = PRIORITY_IDS.indexOf(a.id);
    const bi = PRIORITY_IDS.indexOf(b.id);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return (
    <SectionBlock title="Solve problems fast" description="What usually goes wrong, why it happens, and what to do now.">
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
