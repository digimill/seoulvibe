import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { OliveYoungBudgetBuilder } from "@/components/OliveYoungBudgetBuilder";
import { TravelCalculator } from "@/components/TravelCalculator";
import { isLang, type Lang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

export default async function DailyBudgetPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  return (
    <Container className="py-10 sm:py-14">
      <section className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Daily budget</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">Use a realistic spending baseline before locking your itinerary. General spend and Olive Young budget should be planned together.</p>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">Travel spend baseline</h2>
        <div className="mt-4">
          <TravelCalculator lang={lang as Lang} />
        </div>
      </section>

      <section id="olive-young-budget" className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">Olive Young budget</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-700">Estimate cosmetics and essentials budget before you enter the store so card decisions are faster onsite.</p>
        <div className="mt-4">
          <OliveYoungBudgetBuilder lang={lang as Lang} />
        </div>
      </section>

    </Container>
  );
}
