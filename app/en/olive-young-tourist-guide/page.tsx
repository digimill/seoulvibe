import Link from "next/link";
import { Container } from "@/components/Container";

export default function OliveYoungTouristGuidePage() {
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl">If You Only Have 30 Minutes at Olive Young: Tourist Guide</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">
        Olive Young can waste your time if you walk in without a plan. Shelves are dense, trends rotate fast, and staff are busy during peak hours. For short-term visitors, this is not a discovery mission. It is a problem-solving mission. You need safe basics, clear labels, and fast checkout.
      </p>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">What usually goes wrong?</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-800">Travelers buy too many random items and skip proven basics.</p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">Why it happens?</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-800">Trend pressure, crowded shelves, and no hard spending framework.</p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">What to do immediately?</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-800">Run the $50 pack first, then add max one optional item.</p>
        </article>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-7 text-zinc-800 sm:text-base">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">The 30-minute plan</h2>
        <p>
          Minute 0-5: get your basket and walk one loop only. Do not pick anything yet. Minute 5-15: build your core kit. Minute 15-20: check labels, ingredient notes, and skin type markers. Minute 20-25: check tax refund details and payment line. Minute 25-30: pay and leave. Simple.
        </p>
        <p>
          Why strict timing matters: Olive Young can feel like a candy store. If you browse without structure, you lose one hour and still feel unsure. Your goal is not maximum items. Your goal is stable, useful products that survive travel and work when you get home.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">$50 starter pack</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-900 sm:text-base">
          <li>Cleanser</li>
          <li>Toner</li>
          <li>Sheet mask bundle</li>
          <li>Lip tint</li>
        </ul>
        <p className="mt-4 text-sm leading-7 text-zinc-800 sm:text-base">
          This pack covers basic cleansing, hydration, a travel-friendly treatment option, and one color item. It is enough to test Korean beauty shopping without overcommitting to a complex routine.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">Skip list (seriously)</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-900 sm:text-base">
          <li>10-step routines</li>
          <li>Random trending items</li>
          <li>Products without English label</li>
        </ul>
        <p className="mt-4 text-sm leading-7 text-zinc-800 sm:text-base">
          Ten-step routines look exciting but they are hard to test during travel. Random trend purchases create waste because you do not know fit, ingredients, or interaction with your current routine. If there is no readable label, do not guess. There are enough alternatives with clear packaging.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-7 text-zinc-800 sm:text-base">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">Tax refund, passport, and cards</h2>
        <p>
          Tax refund is possible at many branches. Rules can vary by purchase amount and branch process, so always confirm at checkout. Keep your passport ready. Do not assume a photo on phone is accepted. Bring the physical passport when possible.
        </p>
        <p>
          Major cards are widely accepted. Still, card terminals can fail at busy times or with certain foreign banks. If payment fails once, ask to retry or switch to another terminal. If you hit a kiosk issue in connected retail zones, use the short fix here: <Link href="/en/kiosk-card-rejected" className="underline">card rejected playbook</Link>.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-7 text-zinc-800 sm:text-base">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">How to pick products fast without mistakes</h2>
        <p>
          Start with your skin state, not trends. Dry from flight? prioritize hydration basics. Oily from humid weather? pick light textures. Sensitive from climate shift? avoid strong active ingredients in first purchase. You can always add advanced products later.
        </p>
        <p>
          Look for shelf tags that indicate skin concern categories. Compare two products only, not ten. Read use timing (morning/night) and frequency before buying. If directions are unclear, skip. Clarity is a better filter than popularity.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-7 text-zinc-800 sm:text-base">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">Crowd and branch strategy</h2>
        <p>
          Branches in Hongdae, Myeongdong, and Gangnam can be packed in evening windows. If shelves feel impossible, do not fight the crowd. Move to a branch near your route, especially in mixed residential-commercial zones. Product overlap is usually high enough for a basic starter kit.
        </p>
        <p>
          Need a fast crowd exit now? Use <Link href="/en/crowded" className="underline">this crowd recovery page</Link>. You can return to shopping when lines drop.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-7 text-zinc-800 sm:text-base">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">How this connects to the rest of your Seoul week</h2>
        <p>
          Good Olive Young shopping is really a time-management problem. If you solve transport and payment first, shopping becomes easy. Before store runs, set transport balance with <Link href="/en/how-much-tmoney" className="underline">this T-money guide</Link>. For short tactical instructions inside the app, open <Link href="/en/tips/oliveyoung-master-playbook" className="underline">Olive Young quick fix</Link> and keep it on your phone.
        </p>
        <p>
          If you are building your plan by neighborhood, start at <Link href="/en/areas" className="underline">base area pages</Link>. Picking the right branch near your route can save more time than hunting one specific viral product.
        </p>
      </section>

      <p className="mt-8 text-sm leading-7 text-zinc-700">
        Final rule: leave with useful basics, not maximum bags. Thirty clean minutes beats two confused hours.
      </p>
    </Container>
  );
}
