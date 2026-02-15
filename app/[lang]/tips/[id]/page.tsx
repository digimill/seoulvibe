import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { CopyPhraseButton } from "@/components/CopyPhraseButton";
import { TagBadge } from "@/components/TagBadge";
import { getTips } from "@/lib/content";
import { getCopy, isLang, type Lang } from "@/lib/i18n";
import { toSpotLink } from "@/lib/maps";

type TipDetailPageProps = {
  params: Promise<{ lang: string; id: string }>;
};

function TriadCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5">
      <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-zinc-800">{children}</div>
    </section>
  );
}

function KioskEmergency({ locale }: { locale: Lang }) {
  const phrases = [
    { english: "Can I pay at the counter?", korean: "카운터에서 결제할 수 있을까요?" },
    { english: "My card is not working here.", korean: "여기서 제 카드가 안 돼요." },
    { english: "Can I skip membership and check out as guest?", korean: "회원가입 없이 비회원으로 결제할게요." },
    { english: "Is there an English option?", korean: "영어 옵션 있나요?" },
  ];

  return (
    <>
      <section className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Card rejected at kiosk</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">Don&apos;t freeze. Use this order.</p>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">What to do immediately?</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-800">
          <li>Try tap instead of insert.</li>
          <li>Try another card.</li>
          <li>Ask: &quot;Can I pay at the counter?&quot;</li>
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">No English option?</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-800">
          <li>Look top-right for language.</li>
          <li>If none, use counter.</li>
        </ul>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">Asking phone number?</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-800">
          <li>Skip membership.</li>
          <li>Choose guest checkout.</li>
        </ul>
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2">
        <TriadCard title="What usually goes wrong?">
          Card insert fails. No English menu. Kiosk asks for phone number.
        </TriadCard>
        <TriadCard title="Why it happens?">
          Some cards fail by insert chip. Some kiosks hide language in top-right. Phone number prompt is membership signup, not payment.
        </TriadCard>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">Show Korean phrases to staff</h2>
        <div className="mt-3 space-y-3">
          {phrases.map((phrase) => (
            <div key={phrase.english} className="rounded-xl border border-zinc-200 p-3">
              <p className="mb-2 text-sm font-semibold text-zinc-900">{phrase.english}</p>
              <CopyPhraseButton english={phrase.english} korean={phrase.korean} />
            </div>
          ))}
        </div>
      </section>

      {locale === "en" ? (
        <section className="mt-6 text-sm font-semibold text-zinc-700">
          Need full detail? <Link href="/en/kiosk-card-rejected" className="underline">Read the complete kiosk guide</Link>.
        </section>
      ) : null}
    </>
  );
}

function SubwayEmergency({ locale }: { locale: Lang }) {
  return (
    <>
      <section className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Which subway line should I take?</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">Start from where you sleep, not where you are.</p>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">If you are staying in:</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-800">
          <li>Hongdae - Line 2</li>
          <li>Gangnam - Line 2</li>
          <li>Bukchon - Line 3</li>
          <li>Airport - AREX</li>
        </ul>
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-3">
        <TriadCard title="What usually goes wrong?">People board the wrong direction and lose 20 to 40 minutes.</TriadCard>
        <TriadCard title="Why it happens?">They check color only. They skip final station name. Line 2 circles both ways.</TriadCard>
        <TriadCard title="What to do immediately?">
          <ul className="space-y-2 font-semibold">
            <li>Ignore line color. Check the last station name.</li>
            <li>Line 2 goes both ways.</li>
            <li>If unsure, ask before entering.</li>
          </ul>
        </TriadCard>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">Missed stop?</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-800">
          <li>Get off next station.</li>
          <li>Take opposite train.</li>
          <li>No extra charge within transfer window.</li>
        </ul>
      </section>

      {locale === "en" ? (
        <section className="mt-6 text-sm font-semibold text-zinc-700">
          Card or balance issue? <Link href="/en/how-much-tmoney" className="underline">Check T-money planning</Link>.
        </section>
      ) : null}
    </>
  );
}

function OliveYoungEmergency({ locale }: { locale: Lang }) {
  return (
    <>
      <section className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">If you only have 30 minutes at Olive Young</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">Skip the rabbit hole. Buy what works.</p>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <TriadCard title="What usually goes wrong?">People spend an hour and leave with random hype items they never use.</TriadCard>
        <TriadCard title="Why it happens?">Too many launches. Too many testers. Social media lists are not skin-safe for everyone.</TriadCard>
        <TriadCard title="What to do immediately?">
          Buy the basic set first. Then stop.
        </TriadCard>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">$50 starter pack</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-800">
          <li>Cleanser</li>
          <li>Toner</li>
          <li>Sheet mask bundle</li>
          <li>Lip tint</li>
        </ul>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">Skip</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-800">
          <li>10-step routines</li>
          <li>Random trending items</li>
          <li>Products without English label</li>
        </ul>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">Before you pay</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-800">
          <li>Tax refund possible</li>
          <li>Passport required</li>
          <li>Major cards accepted</li>
        </ul>
      </section>

      {locale === "en" ? (
        <section className="mt-6 text-sm font-semibold text-zinc-700">
          Full breakdown: <Link href="/en/olive-young-tourist-guide" className="underline">Olive Young tourist guide</Link>.
        </section>
      ) : null}
    </>
  );
}

export default async function TipDetailPage({ params }: TipDetailPageProps) {
  const { lang, id } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const t = getCopy(locale);
  const tip = (await getTips(locale)).find((item) => item.id === id);

  if (!tip) notFound();

  const isKiosk = id === "kiosk-survival-flow";
  const isSubway = id === "subway-map-confusion-cuts";
  const isOliveYoung = id === "oliveyoung-master-playbook";

  return (
    <Container className="py-10 sm:py-14">
      <Link href={`/${locale}/tips`} className="text-sm font-semibold text-zinc-600">
        {t.back}
      </Link>

      <div className="mt-4">
        {isKiosk ? <KioskEmergency locale={locale} /> : null}
        {isSubway ? <SubwayEmergency locale={locale} /> : null}
        {isOliveYoung ? <OliveYoungEmergency locale={locale} /> : null}

        {!isKiosk && !isSubway && !isOliveYoung ? (
          <>
            <section className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{tip.title}</h1>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{tip.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tip.tags.map((tag) => (
                  <TagBadge key={tag}>{tag}</TagBadge>
                ))}
              </div>
            </section>

            <section className="mt-6 grid gap-4 sm:grid-cols-3">
              <TriadCard title="What usually goes wrong?">{tip.what_to_know ?? tip.real_scene ?? tip.summary}</TriadCard>
              <TriadCard title="Why it happens?">{tip.why_it_matters ?? tip.local_move ?? "Visitors copy random advice without local context."}</TriadCard>
              <TriadCard title="What to do immediately?">{tip.quick_fix ?? tip.avoid_this ?? "Slow down, reset, and use the shortest next action."}</TriadCard>
            </section>

            {tip.real_spots && tip.real_spots.length > 0 ? (
              <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
                <h2 className="text-lg font-black tracking-tight text-zinc-950">Useful nearby places</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-800">
                  {tip.real_spots
                    .map((spot) => {
                      const link = toSpotLink(spot);
                      return (
                        <a
                          key={link.name}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-700"
                        >
                          {link.name}
                        </a>
                      );
                    })
                    .reduce<ReactNode[]>((acc, node, index) => (index === 0 ? [node] : [...acc, " / ", node]), [])}
                </p>
              </section>
            ) : null}
          </>
        ) : null}
      </div>
    </Container>
  );
}
