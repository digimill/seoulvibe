import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { SectionBlock } from "@/components/SectionBlock";
import { TagBadge } from "@/components/TagBadge";
import { getTips } from "@/lib/content";
import { getCopy, isLang, type Lang } from "@/lib/i18n";

type TipsPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function TipsPage({ params }: TipsPageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const t = getCopy(locale);
  const tips = await getTips(locale);

  return (
    <SectionBlock title={t.nav.tips} description={t.discover}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tips.map((tip) => (
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
