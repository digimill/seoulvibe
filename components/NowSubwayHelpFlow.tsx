"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";

type Scene = "wrong_direction" | "missed_stop" | "transfer_confusion";

type SceneConfig = {
  label: string;
  icon: string;
  lead: string;
  step4: string;
  fallback: string[];
};

type Copy = {
  title: string;
  openerA: string;
  openerB: string;
  where: string;
  whereHint: string;
  orderTitle: string;
  step1Label: string;
  step2Label: string;
  step3Label: string;
  step4Label: string;
  step1: string;
  step2: string;
  step3: string;
  failTitle: string;
  failLine1: string;
  failLine2: string;
  failLine3: string;
  phraseTitle: string;
  phrase: string;
  linksTitle: string;
  l1: string;
  l2: string;
  l3: string;
  scenes: Record<Scene, SceneConfig>;
};

function copy(lang: Lang): Copy {
  if (lang === "ko") {
    return {
      title: "지하철 도움",
      openerA: "길 잘못 들어도 괜찮습니다.",
      openerB: "이 순서로 복구하세요.",
      where: "지금 어떤 상황인가요?",
      whereHint: "상황을 고르면 마지막 단계가 바뀝니다.",
      orderTitle: "즉시 실행 순서",
      step1Label: "1단계",
      step2Label: "2단계",
      step3Label: "3단계",
      step4Label: "4단계",
      step1: "종착역 이름부터 확인하세요.",
      step2: "노선 색보다 방향을 먼저 보세요.",
      step3: "헷갈리면 탑승 전에 한 번 물어보세요.",
      failTitle: "그래도 꼬이면:",
      failLine1: "반대방향 탑승이면 다음 역에서 바로 하차",
      failLine2: "환승 통로는 표지보다 라인 번호/종착역 우선",
      failLine3: "교통카드 잔액 부족 여부 확인",
      phraseTitle: "현장 한 줄",
      phrase: "이 열차 [역명] 가나요?",
      linksTitle: "바로가기",
      l1: "지하철 상세 가이드",
      l2: "티머니 빠른 확인",
      l3: "혼잡 탈출",
      scenes: {
        wrong_direction: {
          label: "반대 방향 탑승",
          icon: "↔️",
          lead: "반대 방향 탑승은 즉시 복구하면 손실이 작습니다.",
          step4: "다음 역에서 내려 반대편 승강장으로 이동하세요.",
          fallback: [
            "급행/완행 구분을 다시 확인하세요.",
            "같은 노선이라도 종착역이 다를 수 있습니다.",
          ],
        },
        missed_stop: {
          label: "내릴 역 놓침",
          icon: "⏭️",
          lead: "지나친 직후 복구하면 추가 요금 없이 되돌리기 쉽습니다.",
          step4: "다음 역 하차 후 반대 열차로 1정거장 복귀하세요.",
          fallback: [
            "환승 시간 창 안이면 추가 요금이 없을 수 있습니다.",
            "출구 번호보다 역명/라인 먼저 맞추세요.",
          ],
        },
        transfer_confusion: {
          label: "환승 혼란",
          icon: "🔀",
          lead: "환승은 색보다 라인 번호와 종착역 기준이 더 정확합니다.",
          step4: "환승 통로에서 라인 번호와 종착역을 다시 확인하세요.",
          fallback: [
            "출구 방향으로 바로 나가지 말고 승강장 안내를 먼저 보세요.",
            "불확실하면 역무원에게 노선번호로 물어보세요.",
          ],
        },
      },
    };
  }

  return {
    title: "Subway help",
    openerA: "Wrong turn is recoverable.",
    openerB: "Use this order.",
    where: "What happened right now?",
    whereHint: "Last step changes by situation.",
    orderTitle: "Immediate recovery order",
    step1Label: "Step 1",
    step2Label: "Step 2",
    step3Label: "Step 3",
    step4Label: "Step 4",
    step1: "Check final station name first.",
    step2: "Prioritize direction over line color.",
    step3: "If unsure, ask once before boarding.",
    failTitle: "If still stuck:",
    failLine1: "Wrong direction: get off at next station",
    failLine2: "Transfers: follow line number + terminal name",
    failLine3: "Check transit card balance",
    phraseTitle: "Quick phrase",
    phrase: "Does this train go to [station name]?",
    linksTitle: "Quick links",
    l1: "Subway deep guide",
    l2: "T-money quick check",
    l3: "Crowd escape",
    scenes: {
      wrong_direction: {
        label: "Wrong direction",
        icon: "↔️",
        lead: "Recover early and you lose minimal time.",
        step4: "Get off at next station and switch platform.",
        fallback: [
          "Re-check express/local type.",
          "Same line can still have different terminals.",
        ],
      },
      missed_stop: {
        label: "Missed stop",
        icon: "⏭️",
        lead: "Fast recovery often avoids extra fare.",
        step4: "Get off next station and take opposite train one stop back.",
        fallback: [
          "Transfer window may still cover fare.",
          "Confirm line + station before exit numbers.",
        ],
      },
      transfer_confusion: {
        label: "Transfer confusion",
        icon: "🔀",
        lead: "Line number + terminal name beats color-only navigation.",
        step4: "Re-check line number and terminal before moving further.",
        fallback: [
          "Do not exit gate before platform direction is confirmed.",
          "Ask staff with line number, not place nickname.",
        ],
      },
    },
  };
}

export function NowSubwayHelpFlow({ lang }: { lang: Lang }) {
  const c = copy(lang);
  const [scene, setScene] = useState<Scene>("wrong_direction");
  const current = useMemo(() => c.scenes[scene], [c.scenes, scene]);

  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{c.title}</h1>
        <p className="mt-4 text-lg font-black">{c.openerA}</p>
        <p className="text-lg font-black">{c.openerB}</p>
      </header>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-xs font-black uppercase tracking-[0.14em] text-zinc-900">{c.where}</h2>
        <p className="mt-1 text-xs font-semibold text-zinc-500">{c.whereHint}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["wrong_direction", "missed_stop", "transfer_confusion"] as const).map((key) => {
            const item = c.scenes[key];
            const active = scene === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setScene(key)}
                className={`rounded-full border px-3 py-1.5 text-sm font-bold ${active ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700"}`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-sm font-semibold text-zinc-700">{current.lead}</p>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-xs font-black uppercase tracking-[0.14em] text-zinc-900">{c.orderTitle}</h2>

        <article className="mt-3 rounded-xl border border-zinc-900 bg-zinc-900 p-4 text-white">
          <p className="text-xs font-black uppercase tracking-[0.14em]">{c.step1Label}</p>
          <p className="mt-1 text-2xl font-black tracking-tight">{c.step1}</p>
        </article>

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <article className="rounded-xl border border-zinc-200 p-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">{c.step2Label}</p>
            <p className="mt-1 text-sm font-black text-zinc-900">{c.step2}</p>
          </article>
          <article className="rounded-xl border border-zinc-200 p-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">{c.step3Label}</p>
            <p className="mt-1 text-sm font-black text-zinc-900">{c.step3}</p>
          </article>
          <article className="rounded-xl border border-zinc-200 p-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">{c.step4Label}</p>
            <p className="mt-1 text-sm font-black text-zinc-900">{current.step4}</p>
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-300 bg-zinc-50 p-5">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">{c.failTitle}</h2>
        <ul className="mt-3 space-y-1 text-sm font-semibold text-zinc-800">
          <li>- {c.failLine1}</li>
          <li>- {c.failLine2}</li>
          <li>- {c.failLine3}</li>
        </ul>

        <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-3">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">{c.phraseTitle}</p>
          <p className="mt-1 text-base font-black text-zinc-900">{c.phrase}</p>
        </div>

        <div className="mt-4 grid gap-2 text-sm font-semibold text-zinc-700">
          {current.fallback.map((line) => (
            <p key={line}>- {line}</p>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-xs font-black uppercase tracking-[0.14em] text-zinc-900">{c.linksTitle}</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
          <Link href={`/${lang}/tips/transport`} className="rounded-full border border-zinc-900 px-4 py-2 text-zinc-900">
            {c.l1}
          </Link>
          <Link href={`/${lang}/now/t-money`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">
            {c.l2}
          </Link>
          <Link href={`/${lang}/now/crowd-escape`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">
            {c.l3}
          </Link>
        </div>
      </section>
    </section>
  );
}
