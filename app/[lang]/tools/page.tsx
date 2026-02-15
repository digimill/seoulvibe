import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { TravelCalculator } from "@/components/TravelCalculator";
import { isLang, type Lang } from "@/lib/i18n";

type ToolsPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function ToolsPage({ params }: ToolsPageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const copy =
    locale === "ko"
      ? {
          title: "도구",
          desc: "서울에서 바로 쓰는 계산 도구입니다. 금액 환산부터 대표 물가 확인까지 한 번에.",
        }
      : locale === "ja"
        ? {
            title: "ツール",
            desc: "ソウルでそのまま使える計算ツール。金額換算と相場確認をすぐに。",
          }
        : locale === "zh-cn"
          ? {
              title: "工具",
              desc: "在首尔可直接使用的计算工具。金额换算和常见物价一页完成。",
            }
          : locale === "zh-tw" || locale === "zh-hk"
            ? {
                title: "工具",
                desc: "在首爾可直接使用的計算工具。金額換算與常見物價一次看完。",
              }
            : {
                title: "Tools",
                desc: "Useful calculator tools for Seoul visitors. Convert money and check typical prices fast.",
              };

  return (
    <Container className="py-10 sm:py-14">
      <section className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{copy.title}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">{copy.desc}</p>
      </section>

      <div className="mt-6">
        <TravelCalculator lang={locale} />
      </div>
    </Container>
  );
}
