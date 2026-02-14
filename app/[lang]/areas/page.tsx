import { notFound } from "next/navigation";
import { AreasMiniMap } from "@/components/AreasMiniMap";
import { Card } from "@/components/Card";
import { SectionBlock } from "@/components/SectionBlock";
import { TagBadge } from "@/components/TagBadge";
import { getAreas } from "@/lib/content";
import { getCopy, isLang, type Lang } from "@/lib/i18n";

type AreasPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function AreasPage({ params }: AreasPageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const t = getCopy(locale);
  const areas = await getAreas(locale);

  return (
    <SectionBlock title={t.nav.areas} description={t.discover}>
      <AreasMiniMap areas={areas} lang={locale} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area) => (
          <Card
            key={area.id}
            href={`/${locale}/areas/${area.id}`}
            title={area.name}
            description={area.summary}
            image={area.image}
            footer={area.tags.map((tag) => (
              <TagBadge key={tag}>{tag}</TagBadge>
            ))}
          />
        ))}
      </div>
    </SectionBlock>
  );
}
