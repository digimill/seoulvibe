import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { SectionBlock } from "@/components/SectionBlock";
import { TagBadge } from "@/components/TagBadge";
import { getAreas } from "@/lib/content";
import { isLang, type Lang } from "@/lib/i18n";

type AreasPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function AreasPage({ params }: AreasPageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const areas = await getAreas(locale);
  const copy =
    locale === "ko"
      ? { title: "숙소 기준 지역 선택", desc: "어디서 자는지 먼저 정하세요. 교통 실수는 여기서 줄일 수 있어요." }
      : locale === "ja"
        ? { title: "滞在エリアを先に決める", desc: "まず宿の場所を基準に。移動ミスを一番減らせます。" }
        : locale === "zh-cn"
          ? { title: "先定住宿片区", desc: "先按住哪里来选区域，交通失误会少很多。" }
          : locale === "zh-tw" || locale === "zh-hk"
            ? { title: "先選住宿區域", desc: "先以住哪裡為基準，交通失誤會少很多。" }
            : { title: "Pick your base area", desc: "Choose where you sleep first. Most transport mistakes start here." };

  return (
    <SectionBlock title={copy.title} description={copy.desc}>
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
