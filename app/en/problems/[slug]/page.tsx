import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { getProblemSeoBySlug, problemSeoItems } from "@/lib/problem-seo";

type ProblemSeoPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return problemSeoItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: ProblemSeoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getProblemSeoBySlug(slug);

  if (!item) return {};

  return {
    title: item.question,
    description: item.shortAnswer.join(" "),
  };
}

export default async function ProblemSeoPage({ params }: ProblemSeoPageProps) {
  const { slug } = await params;
  const item = getProblemSeoBySlug(slug);

  if (!item) notFound();

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl">{item.question}</h1>

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">1. Short direct answer</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-900 sm:text-base">
          {item.shortAnswer.map((line) => (
            <li key={line}>- {line}</li>
          ))}
        </ul>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">2. Why it happens</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-800 sm:text-base">{item.why}</p>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">3. What to do step by step</h2>
        <ol className="mt-3 space-y-2 text-sm font-semibold text-zinc-900 sm:text-base">
          {item.steps.map((step, index) => (
            <li key={step}>{index + 1}. {step}</li>
          ))}
        </ol>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">4. Quick backup plan</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-900 sm:text-base">
          {item.backup.map((line) => (
            <li key={line}>- {line}</li>
          ))}
        </ul>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">5. Link to main Fix page</h2>
        <p className="mt-3 text-sm font-semibold text-zinc-900 sm:text-base">
          <Link href={item.mainFixHref} className="underline">
            {item.mainFixLabel}
          </Link>
        </p>
      </section>

      <section className="mt-8">
        <Link href="/en/problems" className="text-sm font-semibold text-zinc-700 underline">
          View all 20 problem pages
        </Link>
      </section>
    </Container>
  );
}
