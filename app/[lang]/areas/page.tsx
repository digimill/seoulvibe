import { notFound } from "next/navigation";
import { AreasQuickCompare } from "@/components/AreasQuickCompare";
import { Card } from "@/components/Card";
import { SectionBlock } from "@/components/SectionBlock";
import { isLang, type Lang } from "@/lib/i18n";
import { getTravelAreas } from "@/lib/travel-ia";

type AreasPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function AreasPage({ params }: AreasPageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const areas = getTravelAreas(locale);
  const copy =
    locale === "ko"
      ? { title: "Areas: 지역 비교 가이드", desc: "지역별 분위기와 소비 성향을 비교해 내 여행 베이스를 정하세요.", cta: "지역 비교 보기" }
      : locale === "ja"
        ? { title: "Areas: エリア比較ガイド", desc: "エリアごとの雰囲気と支出傾向を比べて、自分に合う滞在ベースを決めましょう。", cta: "エリア比較を見る" }
        : locale === "zh-cn"
          ? { title: "Areas：区域比较指南", desc: "比较各区域的氛围与消费倾向，选出最适合你的住宿基点。", cta: "查看区域比较" }
          : locale === "zh-tw" || locale === "zh-hk"
            ? { title: "Areas：區域比較指南", desc: "比較各區域的氛圍與消費傾向，找出最適合你的住宿據點。", cta: "查看區域比較" }
      : { title: "Areas: Comparison guide", desc: "Compare neighborhood vibe and spend patterns to choose your best base.", cta: "Compare areas" };

  return (
    <SectionBlock title={copy.title} description={copy.desc}>
      <AreasQuickCompare
        lang={locale}
        areas={areas.map((area) => ({ id: area.id, name: area.name }))}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area) => (
          <Card
            key={area.id}
            href={`/${locale}/areas/${area.id}`}
            title={area.name}
            description={area.summary}
            image={area.image}
            imageRatio="16 / 10"
            ctaLabel={copy.cta}
          />
        ))}
      </div>
    </SectionBlock>
  );
}
