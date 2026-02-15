import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/Container";
import { isLang, type Lang } from "@/lib/i18n";
import { TOOL_IDS, getToolCopy } from "@/lib/tools";

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
          desc: "필요한 도구 하나만 고르고 바로 실행하세요.",
        }
      : locale === "ja"
        ? {
            title: "ツール",
            desc: "必要なツールを1つ選んですぐ使う。",
          }
        : locale === "zh-cn"
          ? {
              title: "工具",
              desc: "先选一个你现在最需要的工具。",
            }
          : locale === "zh-tw" || locale === "zh-hk"
            ? {
                title: "工具",
                desc: "先選一個你現在最需要的工具。",
              }
            : {
                title: "Tools",
                desc: "Pick one utility and use it now.",
              };

  return (
    <Container className="py-10 sm:py-14">
      <section className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{copy.title}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">{copy.desc}</p>
      </section>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {TOOL_IDS.map((id) => {
          const item = getToolCopy(locale, id);
          return (
            <Link
              key={id}
              href={`/${locale}/tools/${id}`}
              className="rounded-2xl border-2 border-zinc-900 bg-white p-5 shadow-[0_6px_0_0_rgba(24,24,27,0.95)] transition hover:-translate-y-0.5"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">Utility</p>
              <h2 className="mt-2 text-xl font-black tracking-tight text-zinc-950">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-700">{item.desc}</p>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
