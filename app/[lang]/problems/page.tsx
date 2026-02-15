import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { isLang, type Lang } from "@/lib/i18n";
import { problemSeoItems } from "@/lib/problem-seo";

type PageProps = { params: Promise<{ lang: string }> };

function copy(lang: Lang) {
  if (lang === "ko") return { title: "문제 검색 리스트", desc: "현장에서 자주 터지는 20개 문제를 바로 찾으세요." };
  if (lang === "ja") return { title: "問題ページ一覧", desc: "現場で起きやすい20の問題をすぐ探せます。" };
  if (lang === "zh-cn") return { title: "问题清单", desc: "现场最常见的 20 个问题，直接查。" };
  if (lang === "zh-tw" || lang === "zh-hk") return { title: "問題清單", desc: "現場最常見的 20 個問題，直接查。" };
  return { title: "Seoul Problem Pages", desc: "20 high-intent pages for real visitor problems." };
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const locale = lang as Lang;
  const c = copy(locale);

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl">{c.title}</h1>
      <p className="mt-3 text-sm font-semibold text-zinc-700 sm:text-base">{c.desc}</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {problemSeoItems.map((item) => (
          <Link
            key={item.slug}
            href={`/${locale}/problems/${item.slug}`}
            className="rounded-2xl border border-zinc-300 bg-white p-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
          >
            {item.question}
          </Link>
        ))}
      </div>
    </Container>
  );
}
