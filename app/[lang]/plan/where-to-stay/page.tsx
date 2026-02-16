import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { WhereToStayMatcher } from "@/components/WhereToStayMatcher";
import { isLang, type Lang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

function copy(lang: Lang) {
  if (lang === "ko") {
    return { next: "다음 단계", a1: "지역 가이드 보기", a2: "공항 이동 확인", a3: "여행 중 문제 해결로 이동" };
  }
  if (lang === "ja") {
    return { next: "次のステップ", a1: "エリアガイドを見る", a2: "空港移動を確認", a3: "今すぐ解決へ" };
  }
  if (lang === "zh-cn") {
    return { next: "下一步", a1: "查看区域指南", a2: "确认机场进城", a3: "前往即时解决" };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return { next: "下一步", a1: "查看區域指南", a2: "確認機場進城", a3: "前往即時解決" };
  }
  return { next: "Next", a1: "Open area guides", a2: "Check airport transfer", a3: "Go to live fixes" };
}

export default async function WhereToStayPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const c = copy(locale);

  return (
    <Container className="py-10 sm:py-14">
      <WhereToStayMatcher lang={locale} />

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">{c.next}</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
          <Link href={`/${locale}/areas`} className="rounded-full border border-zinc-900 px-4 py-2 text-zinc-900">{c.a1}</Link>
          <Link href={`/${locale}/plan/airport-to-city`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">{c.a2}</Link>
          <Link href={`/${locale}/now`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">{c.a3}</Link>
        </div>
      </section>
    </Container>
  );
}
