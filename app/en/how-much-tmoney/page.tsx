import Link from "next/link";
import { Container } from "@/components/Container";

export default function HowMuchTmoneyPage() {
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl">How Much T-money to Load in Seoul (Without Guessing)</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">
        You do not need a perfect transport budget. You need enough balance to avoid getting stuck at gates, missing trains, and doing emergency top-ups when you are already late. This guide gives practical loading amounts for short-term visitors, plus a simple refill routine that prevents most transit problems.
      </p>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">What usually goes wrong?</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-800">Card runs low during transfers, at night, or before airport departure.</p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">Why it happens?</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-800">People under-load at start and forget small bus or convenience rides add up.</p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">What to do immediately?</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-800">Load by trip length, keep minimum floor, refill at predictable checkpoints.</p>
        </article>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-7 text-zinc-800 sm:text-base">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">Quick loading rule by stay length</h2>
        <p>
          Use this as your default. 1-2 days in Seoul: load KRW 15,000 to 20,000. 3-4 days: load KRW 25,000 to 35,000. 5-7 days: load KRW 40,000 to 55,000. Add airport rides based on your plan. If you are doing mostly subway and a few buses, this range is usually enough with one refill.
        </p>
        <p>
          If you plan late-night moves, add buffer. Late nights are where people switch to bus or short taxi hops. Even if taxi is paid separately, extra station moves still drain card faster than you expect.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-7 text-zinc-800 sm:text-base">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">The minimum balance floor that saves you</h2>
        <p>
          Keep KRW 7,000 to 10,000 as a hard minimum at all times. Treat this as non-spendable reserve. Why this number? It usually covers several regular rides plus transfer flexibility if you board wrong direction or change plans mid-route.
        </p>
        <p>
          If balance drops below this floor, top up at the next station or convenience store. Do not wait until your card is near zero. Waiting creates the exact stress you are trying to avoid.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-7 text-zinc-800 sm:text-base">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">When to refill (set this routine once)</h2>
        <p>
          Refill on day-start or day-end, not in the middle of rush. Best moments: after breakfast near your base station, after dinner when queues are lighter, or right after airport arrival before first major transfer. Pick one habit and repeat it.
        </p>
        <p>
          Visitors fail here because they rely on memory. Do not rely on memory. Add a phone reminder called “Check T-money before Line 2.” One 5-second check prevents a 20-minute problem.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-7 text-zinc-800 sm:text-base">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">Airport planning: avoid last-minute panic</h2>
        <p>
          Airport transfer days are where balance mistakes hurt most. If you are using AREX or combining subway plus AREX, check your card the night before. Keep enough for your route to station and one backup move. If you think you are close to empty, top up before sleep, not at checkout time.
        </p>
        <p>
          Morning airport runs stack stress fast: hotel checkout, baggage, timing, platform changes. Removing one variable gives you margin. Transit balance should never be the thing that delays your departure.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-7 text-zinc-800 sm:text-base">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">Where visitors miscalculate</h2>
        <p>
          Common mistake one: counting only subway rides and forgetting buses. Common mistake two: assuming no reroutes. In Seoul, one wrong platform direction can add two extra rides quickly. Common mistake three: forgetting that tired evenings reduce decision quality. You make more route corrections when you are tired.
        </p>
        <p>
          The fix is simple: build budget for imperfect movement, not perfect movement. Perfect movement does not exist in real travel days.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-7 text-zinc-800 sm:text-base">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">Pair this with line selection strategy</h2>
        <p>
          If you stay in Hongdae or Gangnam, you will touch Line 2 a lot. Line 2 at 6-8pm is crowded and mentally draining. More crowd means more rushed decisions and more transfer mistakes. Check the in-app subway triage before every evening move: <Link href="/en/tips/subway-map-confusion-cuts" className="underline">which line should I take?</Link>
        </p>
        <p>
          If your card is low and the station queue is long, do not gamble on getting through fast. Move one station earlier where queues are shorter, then top up there. That one tactical shift can save your entire dinner reservation.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-7 text-zinc-800 sm:text-base">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">One-week sample plan</h2>
        <p>
          Day 1 arrival: load KRW 30,000. Day 3 evening: check balance. If below KRW 12,000, top up KRW 15,000. Day 5 night: check again before weekend movement. If below KRW 10,000, top up KRW 10,000 to 15,000. Night before airport: confirm minimum KRW 10,000 plus route needs.
        </p>
        <p>
          This is intentionally boring. Boring systems survive tired travel days. Fancy optimization fails when you are hungry and surrounded by crowds.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-7 text-zinc-800 sm:text-base">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">Useful internal links for full setup</h2>
        <p>
          If payment fails at stores, use <Link href="/en/kiosk-card-rejected" className="underline">the kiosk card rejected playbook</Link>. For shopping without wasting time, use <Link href="/en/olive-young-tourist-guide" className="underline">the Olive Young tourist guide</Link>. For area-based movement, start at <Link href="/en/areas" className="underline">base area guide</Link>. If your current location is overloaded, switch to <Link href="/en/crowded" className="underline">crowd escape steps</Link>.
        </p>
      </section>

      <p className="mt-8 text-sm leading-7 text-zinc-700">
        Final rule: T-money is not about getting exact totals. It is about preserving movement. Keep a floor, refill early, and travel with slack.
      </p>
    </Container>
  );
}
