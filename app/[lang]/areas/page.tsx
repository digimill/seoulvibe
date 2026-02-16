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
      ? { title: "Areas: 판단형 지역 가이드", desc: "소개보다 결정이 먼저입니다. 먼저 '여기 맞는 경우 / 피해야 할 경우'를 확인하세요.", cta: "지금 판단하기" }
      : locale === "ja"
        ? { title: "Areas: 判断型エリアガイド", desc: "紹介より判断が先です。まず「向いている人 / 避けるべき人」を確認してください。", cta: "今すぐ判断" }
        : locale === "zh-cn"
          ? { title: "Areas：判断型区域指南", desc: "先做决定，再看介绍。先看“适合谁 / 不适合谁”。", cta: "立即判断" }
          : locale === "zh-tw" || locale === "zh-hk"
            ? { title: "Areas：判斷型區域指南", desc: "先做決定，再看介紹。先看「適合誰 / 不適合誰」。", cta: "立即判斷" }
      : { title: "Areas: Decide, don't browse", desc: "Start with fit and mismatch signals. Then commit your base.", cta: "Decide now" };

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
