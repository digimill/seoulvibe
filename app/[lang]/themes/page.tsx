import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { SectionBlock } from "@/components/SectionBlock";
import { TagBadge } from "@/components/TagBadge";
import { getThemes } from "@/lib/content";
import { getCopy, isLang, type Lang } from "@/lib/i18n";

type ThemesPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function ThemesPage({ params }: ThemesPageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const t = getCopy(locale);
  const themes = await getThemes(locale);

  return (
    <SectionBlock title={t.nav.themes} description={t.discover}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => (
          <Card
            key={theme.id}
            href={`/${locale}/themes/${theme.id}`}
            title={theme.title}
            description={theme.summary}
            image={theme.image}
            footer={theme.tags.map((tag) => (
              <TagBadge key={tag}>{tag}</TagBadge>
            ))}
          />
        ))}
      </div>
    </SectionBlock>
  );
}
