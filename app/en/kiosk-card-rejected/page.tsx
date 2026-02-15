import Link from "next/link";
import { Container } from "@/components/Container";

export default function KioskCardRejectedSeoPage() {
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl">Card Rejected at Seoul Kiosk: What to Do in 60 Seconds</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">
        You are hungry, tired, and in a line. You tap your card. It fails. You insert it. It fails again. The person behind you sighs. This is one of the most common first-week problems for short-term visitors in Seoul. The good news: most kiosk failures are not real payment failures. They are flow failures. If you know the order, you can finish in one minute.
      </p>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">What usually goes wrong?</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-800">Chip insert fails, language is hidden, and phone number prompts block checkout.</p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">Why it happens?</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-800">Different terminals, local membership flows, and rushed UI design in busy stores.</p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">What to do immediately?</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-800">Tap first, switch card, then ask to pay at counter. Do not keep retrying the same screen.</p>
        </article>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-7 text-zinc-800 sm:text-base">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">Use this order every time</h2>
        <p>
          Step one: try tap payment before chip insert. Some Korean kiosk readers are more reliable with NFC than with foreign chip cards. Step two: if tap fails once, do not retry three more times. Use a second card immediately if you have one. Step three: if both fail, stop using the kiosk and move to staff. Ask one sentence: “Can I pay at the counter?” This saves your time and everyone else’s.
        </p>
        <p>
          Most visitors lose time because they treat kiosk failure like bank failure. It is usually not that. Your card often works fine at the counter using a different terminal. The kiosk is just one device in one store. Do not let one device decide your whole day.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-7 text-zinc-800 sm:text-base">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">No English button? Do this</h2>
        <p>
          On many kiosks the language switch is in the top-right corner. It can be tiny. It might be a globe icon, “EN,” or a small menu text. Check there first. If there is no language switch, skip the kiosk. Go straight to counter.
        </p>
        <p>
          A lot of travelers burn ten minutes trying to decode Korean menu terms under pressure. That is the expensive way to handle a cheap task. Counter payment is normal. Staff see this every day. It is not rude to ask. It is efficient.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-7 text-zinc-800 sm:text-base">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">Phone number prompt is not mandatory payment</h2>
        <p>
          Many kiosks ask for a phone number because they try to enroll you in membership points. Visitors think this is required and freeze. It is usually optional. Look for “Skip,” “Guest,” or the smallest secondary button at the bottom. If no clear skip exists, again, use counter.
        </p>
        <p>
          This one detail causes huge stress because the screen looks “official.” It is not a legal identity check. It is just loyalty marketing. Treat it like that and move on.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-7 text-zinc-800 sm:text-base">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">Fast phrase set that works</h2>
        <p>Memorize these lines before you leave your hotel:</p>
        <ul className="space-y-2 font-semibold">
          <li>Can I pay at the counter?</li>
          <li>My card is not working here.</li>
          <li>Can I skip membership and check out as guest?</li>
          <li>Is there an English option?</li>
        </ul>
        <p>
          Keep your tone calm and simple. You do not need a long explanation. One clean sentence plus eye contact is enough. If the store is crowded, hold your card in hand while asking. Staff instantly understand the context.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-7 text-zinc-800 sm:text-base">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">Store types where kiosk problems spike</h2>
        <p>
          You will see most failures in fast-food chains, self-order cafes, and busy food courts connected to stations. These places optimize for local repeat customers. That means heavy shortcut design, Korean-first labels, and minimal support screens. It is not anti-tourist. It is just designed for speed at volume.
        </p>
        <p>
          If you know you will hit these zones, eat fifteen to twenty minutes earlier than peak lunch or dinner. Queue pressure makes every small issue feel bigger. Time buffering is one of the easiest travel hacks in Seoul.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-7 text-zinc-800 sm:text-base">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">Related fixes you should set up today</h2>
        <p>
          Kiosk stress and subway stress often happen in the same hour. Set your transport and payment baseline now so the next problem is smaller. Read <Link href="/en/how-much-tmoney" className="underline">how much T-money to load</Link> before evening rush. If you are shopping for essentials, use the short list in <Link href="/en/olive-young-tourist-guide" className="underline">this Olive Young tourist guide</Link> so you do not waste time in store.
        </p>
        <p>
          For the short in-app version, open the emergency card route: <Link href="/en/tips/kiosk-survival-flow" className="underline">kiosk quick fix</Link>. If a station is packed and you need crowd recovery, use <Link href="/en/crowded" className="underline">crowd escape steps</Link>.
        </p>
      </section>

      <p className="mt-8 text-sm leading-7 text-zinc-700">
        Final rule: do not fight a broken kiosk for pride. Your mission is to get fed and keep moving. Tap once, switch once, ask once, and continue your day.
      </p>
    </Container>
  );
}
