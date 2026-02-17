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
      ? { title: "Areas: 가격 맥락 가이드", desc: "지역별 체류 감각과 소비 밀도를 비교해 Plan 예산을 조정하세요.", cta: "가격 맥락 보기" }
      : locale === "ja"
        ? { title: "Areas: 価格コンテキストガイド", desc: "エリアごとの滞在感と消費密度を見て、Plan予算を調整します。", cta: "価格感を確認" }
        : locale === "zh-cn"
          ? { title: "Areas：价格语境指南", desc: "比较不同区域的停留节奏与消费密度，再调整 Plan 预算。", cta: "查看价格语境" }
          : locale === "zh-tw" || locale === "zh-hk"
            ? { title: "Areas：價格語境指南", desc: "比較不同區域的停留節奏與消費密度，再調整 Plan 預算。", cta: "查看價格語境" }
      : { title: "Areas: Price context guide", desc: "Compare spend intensity by area, then tune your Plan budget.", cta: "View price context" };

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
