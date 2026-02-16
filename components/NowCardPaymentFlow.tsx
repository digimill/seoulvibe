"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";

type PaymentScene = "counter" | "taxi" | "convenience";
type DebitMode = "yes" | "no";

type SceneConfig = {
  label: string;
  icon: string;
  lead: string;
  scenario: string[];
  step4: string;
};

type Copy = {
  title: string;
  openerA: string;
  openerB: string;
  where: string;
  whereHint: string;
  debitQ: string;
  yes: string;
  no: string;
  debitWarnTitle: string;
  debitWarnBody: string;
  runOrder: string;
  step1: string;
  step2: string;
  step3: string;
  step1Label: string;
  step2Label: string;
  step3Label: string;
  step4Label: string;
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
  scenes: Record<PaymentScene, SceneConfig>;
};

function copy(lang: Lang): Copy {
  if (lang === "ko") {
    return {
      title: "카드 결제",
      openerA: "당황하지 마세요.",
      openerB: "이 순서대로만 하세요.",
      where: "어디에서 결제 중인가요?",
      whereHint: "현재 결제 상황을 선택하세요.",
      debitQ: "해외 체크카드인가요?",
      yes: "예",
      no: "아니오",
      debitWarnTitle: "실패 위험 높음",
      debitWarnBody: "해외 체크카드는 키오스크에서 실패율이 높습니다. 카운터로 바로 전환하세요.",
      runOrder: "즉시 실행 순서",
      step1: "탭 결제를 먼저 시도하세요.",
      step2: "같은 화면에서 반복하지 마세요.",
      step3: "다른 카드 1회만 시도하세요.",
      step1Label: "1단계",
      step2Label: "2단계",
      step3Label: "3단계",
      step4Label: "4단계",
      failTitle: "그래도 실패하면:",
      failLine1: "해외 체크카드는 오프라인 결제가 안 될 수 있습니다.",
      failLine2: "일부 결제 단말은 해외 PIN을 지원하지 않습니다.",
      failLine3: "" + "\"카운터 결제 가능해요?\"" + " 라고 물어보세요.",
      phraseTitle: "현장 한 줄",
      phrase: "카운터 결제 가능해요?",
      linksTitle: "바로가기",
      l1: "키오스크 오류 가이드",
      l2: "현금 결제 가이드",
      l3: "티머니 가이드",
      scenes: {
        counter: {
          label: "카운터",
          icon: "🧑",
          lead: "카운터는 직원 대응이 가능하므로 빠른 전환이 핵심입니다.",
          scenario: ["칩 인식 실패 시 탭 결제로 즉시 전환하세요.", "승인 지연이면 다른 단말 재시도를 요청하세요."],
          step4: "다른 단말 재시도를 요청하세요.",
        },
        taxi: {
          label: "택시",
          icon: "🚕",
          lead: "택시는 결제 단말 상태가 차량별로 다를 수 있습니다.",
          scenario: ["탭 인식 실패 시 다른 카드로 1회만 재시도하세요.", "하차 전 결제수단 변경 가능 여부를 바로 물어보세요."],
          step4: "하차 전 다른 결제수단을 요청하세요.",
        },
        convenience: {
          label: "편의점",
          icon: "🏪",
          lead: "편의점은 단말이 안정적인 편이지만 해외 체크카드는 실패 가능성이 있습니다.",
          scenario: ["해외 체크카드 거절 시 신용카드 또는 현금으로 전환하세요.", "소액 결제 연속 거절이면 현금 결제 가능 여부를 물어보세요."],
          step4: "현금 결제 가능 여부를 물어보세요.",
        },
      },
    };
  }

  if (lang === "ja") {
    return {
      title: "カード決済",
      openerA: "焦らなくて大丈夫。",
      openerB: "この順番で進めてください。",
      where: "どこで支払っていますか？",
      whereHint: "現在の支払い状況を選んでください。",
      debitQ: "海外発行のデビットカードですか？",
      yes: "はい",
      no: "いいえ",
      debitWarnTitle: "失敗リスク高め",
      debitWarnBody: "海外デビットはキオスク失敗率が高めです。カウンターへ切替えてください。",
      runOrder: "即実行手順",
      step1: "まずタッチ決済を試す。",
      step2: "同じ画面で連打しない。",
      step3: "別カードを1回だけ試す。",
      step1Label: "Step 1",
      step2Label: "Step 2",
      step3Label: "Step 3",
      step4Label: "Step 4",
      failTitle: "それでも失敗する場合:",
      failLine1: "海外デビットはオフライン決済で通らないことがあります。",
      failLine2: "一部端末は海外PINに非対応です。",
      failLine3: "「カウンターで支払えますか？」と確認してください。",
      phraseTitle: "現場フレーズ",
      phrase: "Can I pay at the counter?",
      linksTitle: "クイックリンク",
      l1: "キオスクエラーガイド",
      l2: "現金オプションガイド",
      l3: "T-moneyガイド",
      scenes: {
        counter: {
          label: "カウンター",
          icon: "🧑",
          lead: "カウンターでは端末切替の速さが重要です。",
          scenario: ["IC読取失敗ならタッチ決済へ切替。", "承認遅延なら別端末再試行を依頼。"],
          step4: "別端末での再試行を依頼する。",
        },
        taxi: {
          label: "タクシー",
          icon: "🚕",
          lead: "タクシーは車両ごとに端末状態が異なります。",
          scenario: ["タッチ失敗なら別カードで1回だけ再試行。", "到着前に他の支払い方法が可能か確認。"],
          step4: "到着前に別決済方法を依頼する。",
        },
        convenience: {
          label: "コンビニ",
          icon: "🏪",
          lead: "コンビニは安定していますが海外デビットは失敗することがあります。",
          scenario: ["海外デビット拒否ならクレカまたは現金へ切替。", "少額連続拒否なら現金可否を確認。"],
          step4: "現金支払いが可能か確認する。",
        },
      },
    };
  }

  if (lang === "zh-cn") {
    return {
      title: "刷卡支付",
      openerA: "先别慌。",
      openerB: "按这个顺序做。",
      where: "你现在在哪里付款？",
      whereHint: "请选择你当前的支付场景。",
      debitQ: "这是境外借记卡吗？",
      yes: "是",
      no: "否",
      debitWarnTitle: "失败风险更高",
      debitWarnBody: "境外借记卡在自助机失败率更高，建议直接转柜台。",
      runOrder: "立即执行顺序",
      step1: "先试感应支付。",
      step2: "不要在同一页面反复点。",
      step3: "换另一张卡只试一次。",
      step1Label: "步骤 1",
      step2Label: "步骤 2",
      step3Label: "步骤 3",
      step4Label: "步骤 4",
      failTitle: "如果还是失败:",
      failLine1: "境外借记卡在离线场景可能无法通过。",
      failLine2: "部分支付终端不支持海外PIN。",
      failLine3: "请问：\"可以柜台付款吗？\"",
      phraseTitle: "现场一句话",
      phrase: "Can I pay at the counter?",
      linksTitle: "快速入口",
      l1: "自助机报错指南",
      l2: "现金支付指南",
      l3: "T-money 指南",
      scenes: {
        counter: {
          label: "柜台",
          icon: "🧑",
          lead: "柜台场景关键是快速换终端。",
          scenario: ["插卡失败就改感应。", "审批过慢就请求换终端再试。"],
          step4: "请求换一台终端再试。",
        },
        taxi: {
          label: "出租车",
          icon: "🚕",
          lead: "出租车终端状态因车辆而异。",
          scenario: ["感应失败就换卡只重试一次。", "到达前先确认能否改付款方式。"],
          step4: "到达前请求改支付方式。",
        },
        convenience: {
          label: "便利店",
          icon: "🏪",
          lead: "便利店终端较稳定，但境外借记卡仍可能失败。",
          scenario: ["借记卡拒付就改信用卡或现金。", "小额连续失败就问能否现金。"],
          step4: "询问是否可现金付款。",
        },
      },
    };
  }

  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      title: "刷卡支付",
      openerA: "先不用慌。",
      openerB: "照這個順序做。",
      where: "你現在在哪裡付款？",
      whereHint: "請選擇你目前的支付情境。",
      debitQ: "這是海外簽帳金融卡嗎？",
      yes: "是",
      no: "否",
      debitWarnTitle: "失敗風險較高",
      debitWarnBody: "海外簽帳金融卡在自助機失敗率較高，建議直接轉櫃檯。",
      runOrder: "立即執行順序",
      step1: "先試感應支付。",
      step2: "不要在同一頁面反覆點擊。",
      step3: "換另一張卡只試一次。",
      step1Label: "步驟 1",
      step2Label: "步驟 2",
      step3Label: "步驟 3",
      step4Label: "步驟 4",
      failTitle: "如果還是失敗:",
      failLine1: "海外簽帳金融卡在離線場景可能無法通過。",
      failLine2: "部分支付終端不支援海外PIN。",
      failLine3: "請問：\"可以櫃檯付款嗎？\"",
      phraseTitle: "現場一句話",
      phrase: "Can I pay at the counter?",
      linksTitle: "快速入口",
      l1: "自助機錯誤指南",
      l2: "現金支付指南",
      l3: "T-money 指南",
      scenes: {
        counter: {
          label: "櫃檯",
          icon: "🧑",
          lead: "櫃檯場景的關鍵是快速換終端。",
          scenario: ["插卡失敗就改感應。", "授權延遲就請店員換終端再試。"],
          step4: "請求換另一台終端重試。",
        },
        taxi: {
          label: "計程車",
          icon: "🚕",
          lead: "計程車終端狀態會因車輛而異。",
          scenario: ["感應失敗就換卡只重試一次。", "到站前先確認能否改付款方式。"],
          step4: "到站前請求改付款方式。",
        },
        convenience: {
          label: "便利商店",
          icon: "🏪",
          lead: "便利商店終端較穩定，但海外簽帳金融卡仍可能失敗。",
          scenario: ["簽帳金融卡拒付就改信用卡或現金。", "小額連續失敗就問是否可現金。"],
          step4: "詢問是否可現金付款。",
        },
      },
    };
  }

  return {
    title: "Card payment",
    openerA: "Don’t panic.",
    openerB: "Try this order.",
    where: "Where are you paying?",
    whereHint: "Choose your current payment situation.",
    debitQ: "Is this a foreign debit card?",
    yes: "Yes",
    no: "No",
    debitWarnTitle: "Higher failure risk",
    debitWarnBody: "Foreign debit cards fail more often at kiosks. Move to counter quickly.",
    runOrder: "Immediate order",
    step1: "Tap first.",
    step2: "Do not repeat on same screen.",
    step3: "Try another card.",
    step1Label: "Step 1",
    step2Label: "Step 2",
    step3Label: "Step 3",
    step4Label: "Step 4",
    failTitle: "If it still fails:",
    failLine1: "Foreign debit may not work offline",
    failLine2: "Some payment terminals don’t support overseas PIN",
    failLine3: "Ask: \"Can I pay at the counter?\"",
    phraseTitle: "Quick phrase",
    phrase: "Can I pay at the counter?",
    linksTitle: "Quick links",
    l1: "Kiosk error guide",
    l2: "Cash option guide",
    l3: "T-money guide",
    scenes: {
      counter: {
        label: "Counter",
        icon: "🧑",
        lead: "At counter, fast terminal switch is key.",
        scenario: ["If chip read fails, switch to tap immediately.", "If approval lags, ask to retry on another terminal."],
        step4: "Ask to retry on another terminal.",
      },
      taxi: {
        label: "Taxi",
        icon: "🚕",
        lead: "Taxi card terminals vary by vehicle.",
        scenario: ["If tap fails, retry once with another card.", "Before arrival, ask if another payment method is possible."],
        step4: "Ask for another payment method before ride ends.",
      },
      convenience: {
        label: "Convenience store",
        icon: "🏪",
        lead: "Convenience stores are stable but foreign debit can still fail.",
        scenario: ["If foreign debit declines, switch to credit or cash.", "If repeated small declines happen, ask for cash option."],
        step4: "Ask for cash payment option.",
      },
    },
  };
}

export function NowCardPaymentFlow({ lang }: { lang: Lang }) {
  const c = copy(lang);
  const [scene, setScene] = useState<PaymentScene>("counter");
  const [debit, setDebit] = useState<DebitMode>("no");
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
          {(["counter", "taxi", "convenience"] as const).map((key) => {
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
        <h2 className="text-xs font-black uppercase tracking-[0.14em] text-zinc-900">{c.debitQ}</h2>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setDebit("yes")}
            className={`rounded-full border px-3 py-1.5 text-sm font-bold ${debit === "yes" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700"}`}
          >
            {c.yes}
          </button>
          <button
            type="button"
            onClick={() => setDebit("no")}
            className={`rounded-full border px-3 py-1.5 text-sm font-bold ${debit === "no" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700"}`}
          >
            {c.no}
          </button>
        </div>
        {debit === "yes" ? (
          <div className="mt-3 rounded-xl border border-zinc-300 bg-zinc-50 p-3">
            <p className="text-sm font-black text-zinc-900">{c.debitWarnTitle}</p>
            <p className="mt-1 text-sm text-zinc-700">{c.debitWarnBody}</p>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-xs font-black uppercase tracking-[0.14em] text-zinc-900">{c.runOrder}</h2>

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
          {current.scenario.map((line) => (
            <p key={line}>- {line}</p>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-xs font-black uppercase tracking-[0.14em] text-zinc-900">{c.linksTitle}</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
          <Link href={`/${lang}/now/kiosk/card-rejected`} className="rounded-full border border-zinc-900 px-4 py-2 text-zinc-900">
            {c.l1}
          </Link>
          <Link href={`/${lang}/tips/payment`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">
            {c.l2}
          </Link>
          <Link href={`/${lang}/now/t-money`} className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">
            {c.l3}
          </Link>
        </div>
      </section>
    </section>
  );
}
