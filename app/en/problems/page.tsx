import Link from "next/link";
import { Container } from "@/components/Container";
import { problemSeoItems } from "@/lib/problem-seo";

export default function ProblemsIndexPage() {
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl">Seoul Problem Pages</h1>
      <p className="mt-3 text-sm font-semibold text-zinc-700 sm:text-base">20 high-intent pages for real visitor problems.</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {problemSeoItems.map((item) => (
          <Link
            key={item.slug}
            href={`/en/problems/${item.slug}`}
            className="rounded-2xl border border-zinc-300 bg-white p-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
          >
            {item.question}
          </Link>
        ))}
      </div>
    </Container>
  );
}
