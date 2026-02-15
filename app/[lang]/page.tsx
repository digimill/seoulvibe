import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { isLang, type Lang } from "@/lib/i18n";

type HomePageProps = {
  params: Promise<{ lang: string }>;
};

type EmergencyCard = {
  title: string;
  href: string;
  note: string;
};

function getEmergencyCards(lang: Lang): EmergencyCard[] {
  return [
    {
      title: "Card rejected at kiosk",
      href: `/${lang}/tips/kiosk-survival-flow`,
      note: "Tap. Switch card. Move to counter.",
    },
    {
      title: "Which subway line should I take?",
      href: `/${lang}/tips/subway-map-confusion-cuts`,
      note: "Pick your base line first.",
    },
    {
      title: "What should I buy at Olive Young?",
      href: `/${lang}/tips/oliveyoung-master-playbook`,
      note: "Get the $50 starter pack.",
    },
    {
      title: "It's too crowded here",
      href: `/${lang}/crowded`,
      note: "Exit fast. Reset route.",
    },
  ];
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const emergencyCards = getEmergencyCards(locale);

  return (
    <Container className="py-8 sm:py-12">
      <section className="rounded-3xl border border-red-900/20 bg-red-50 p-6 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-800">Seoul Emergency Guide</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-zinc-950 sm:text-6xl">Stuck in Seoul?</h1>
        <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-zinc-800 sm:text-xl">
          Card rejected? Missed the subway? Don&apos;t know what to buy?
          <br />
          Start here.
        </p>
      </section>

      <section className="mt-8 sm:mt-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {emergencyCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="rounded-3xl border-2 border-zinc-900 bg-white p-5 shadow-[0_10px_0_0_rgba(24,24,27,0.95)] transition hover:-translate-y-0.5 hover:bg-zinc-50"
            >
              <p className="text-xl font-extrabold tracking-tight text-zinc-950">{card.title}</p>
              <p className="mt-2 text-sm font-semibold text-zinc-700">{card.note}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-zinc-200 bg-white p-6 sm:mt-12 sm:p-8">
        <h2 className="text-xl font-extrabold tracking-tight text-zinc-950">If you&apos;re staying in:</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`/${locale}/areas/hongdae`} className="rounded-full border border-zinc-900 px-4 py-2 text-sm font-bold text-zinc-900">
            Hongdae
          </Link>
          <Link href={`/${locale}/areas/seongsu`} className="rounded-full border border-zinc-900 px-4 py-2 text-sm font-bold text-zinc-900">
            Seongsu
          </Link>
          <Link href={`/${locale}/areas/bukchon`} className="rounded-full border border-zinc-900 px-4 py-2 text-sm font-bold text-zinc-900">
            Bukchon
          </Link>
          <Link href={`/${locale}/tips/subway-map-confusion-cuts`} className="rounded-full border border-zinc-900 px-4 py-2 text-sm font-bold text-zinc-900">
            Gangnam
          </Link>
        </div>
      </section>

      {locale === "en" ? (
        <section className="mt-10 rounded-3xl border border-zinc-200 bg-white p-6 sm:mt-12 sm:p-8">
          <h2 className="text-xl font-extrabold tracking-tight text-zinc-950">Deep guides</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Link href="/en/kiosk-card-rejected" className="rounded-2xl border border-zinc-300 p-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50">
              Kiosk card rejected guide
            </Link>
            <Link href="/en/how-much-tmoney" className="rounded-2xl border border-zinc-300 p-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50">
              How much T-money you need
            </Link>
            <Link href="/en/olive-young-tourist-guide" className="rounded-2xl border border-zinc-300 p-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50">
              Olive Young tourist guide
            </Link>
          </div>
        </section>
      ) : null}
    </Container>
  );
}
