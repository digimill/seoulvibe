"use client";

import { useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";

type ConfuseKey = "color" | "direction" | "express" | "exit";
type StationKey =
  | "hongdae"
  | "cityhall"
  | "euljiro3"
  | "ddp"
  | "wangsimni"
  | "seongsu"
  | "konkuk"
  | "gangnam"
  | "jamsil"
  | "samseong";

type StationDef = {
  key: StationKey;
  en: string;
  ko: string;
  ja: string;
  "zh-cn": string;
  "zh-tw": string;
  "zh-hk": string;
  aliases: string[];
};

type LineKey = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

const LINE_STYLES: Record<LineKey, { bg: string; text: string; border: string }> = {
  "1": { bg: "#0052A4", text: "#FFFFFF", border: "#00417F" },
  "2": { bg: "#00A84D", text: "#FFFFFF", border: "#008A3F" },
  "3": { bg: "#EF7C1C", text: "#FFFFFF", border: "#C76616" },
  "4": { bg: "#00A5DE", text: "#FFFFFF", border: "#0088B7" },
  "5": { bg: "#996CAC", text: "#FFFFFF", border: "#7E588E" },
  "6": { bg: "#CD7C2F", text: "#FFFFFF", border: "#A86426" },
  "7": { bg: "#747F00", text: "#FFFFFF", border: "#5E6700" },
  "8": { bg: "#E6186C", text: "#FFFFFF", border: "#BD1358" },
  "9": { bg: "#BDB092", text: "#1A1A1A", border: "#9D9279" },
};

const STATIONS: StationDef[] = [
  { key: "hongdae", en: "Hongdae", ko: "홍대입구", ja: "弘大入口", "zh-cn": "弘大入口", "zh-tw": "弘大入口", "zh-hk": "弘大入口", aliases: ["hongdae", "hongik", "hongikuniv", "hongikuniversity", "홍대", "홍대입구"] },
  { key: "cityhall", en: "City Hall", ko: "시청", ja: "市庁", "zh-cn": "市厅", "zh-tw": "市廳", "zh-hk": "市廳", aliases: ["cityhall", "city hall", "시청"] },
  { key: "euljiro3", en: "Euljiro 3-ga", ko: "을지로3가", ja: "乙支路3街", "zh-cn": "乙支路3街", "zh-tw": "乙支路3街", "zh-hk": "乙支路3街", aliases: ["euljiro3", "euljiro3ga", "euljiro 3-ga", "을지로3가", "을지로 3가"] },
  { key: "ddp", en: "Dongdaemun History & Culture Park", ko: "동대문역사문화공원", ja: "東大門歴史文化公園", "zh-cn": "东大门历史文化公园", "zh-tw": "東大門歷史文化公園", "zh-hk": "東大門歷史文化公園", aliases: ["dongdaemun", "ddp", "dongdaemun history", "동대문", "동대문역사문화공원"] },
  { key: "wangsimni", en: "Wangsimni", ko: "왕십리", ja: "往十里", "zh-cn": "往十里", "zh-tw": "往十里", "zh-hk": "往十里", aliases: ["wangsimni", "왕십리"] },
  { key: "seongsu", en: "Seongsu", ko: "성수", ja: "聖水", "zh-cn": "圣水", "zh-tw": "聖水", "zh-hk": "聖水", aliases: ["seongsu", "성수"] },
  { key: "konkuk", en: "Konkuk Univ.", ko: "건대입구", ja: "建大入口", "zh-cn": "建大入口", "zh-tw": "建大入口", "zh-hk": "建大入口", aliases: ["konkuk", "konkukuniv", "konkuk university", "건대", "건대입구"] },
  { key: "gangnam", en: "Gangnam", ko: "강남", ja: "江南", "zh-cn": "江南", "zh-tw": "江南", "zh-hk": "江南", aliases: ["gangnam", "강남"] },
  { key: "jamsil", en: "Jamsil", ko: "잠실", ja: "蚕室", "zh-cn": "蚕室", "zh-tw": "蠶室", "zh-hk": "蠶室", aliases: ["jamsil", "잠실"] },
  { key: "samseong", en: "Samseong", ko: "삼성", ja: "三成", "zh-cn": "三成", "zh-tw": "三成", "zh-hk": "三成", aliases: ["samseong", "coex", "코엑스", "삼성"] },
] as const;

const LINE2_ORDER: StationKey[] = ["cityhall", "euljiro3", "ddp", "wangsimni", "seongsu", "konkuk", "gangnam", "jamsil", "samseong", "hongdae"];

const STATION_MAP = new Map(STATIONS.map((item) => [item.key, item]));

function normalizeName(value: string): string {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s\-_.(),'"&]/g, "");
}

const ALIAS_TO_KEY = (() => {
  const map = new Map<string, StationKey>();
  STATIONS.forEach((station) => {
    const all = [station.en, station.ko, station.ja, station["zh-cn"], station["zh-tw"], station["zh-hk"], ...station.aliases];
    all.forEach((alias) => {
      map.set(normalizeName(alias), station.key);
    });
  });
  return map;
})();

function toStationKey(value: string): StationKey | null {
  return ALIAS_TO_KEY.get(normalizeName(value)) ?? null;
}

function stationLabel(key: StationKey, lang: Lang): string {
  const station = STATION_MAP.get(key);
  if (!station) return key;
  if (lang === "ko") return station.ko;
  if (lang === "ja") return station.ja;
  if (lang === "zh-cn") return station["zh-cn"];
  if (lang === "zh-tw") return station["zh-tw"];
  if (lang === "zh-hk") return station["zh-hk"];
  return station.en;
}

function lineLabel(lineKey: LineKey, lang: Lang): string {
  if (lang === "ko") return `${lineKey}호선`;
  if (lang === "ja") return `${lineKey}号線`;
  if (lang === "zh-cn") return `${lineKey}号线`;
  if (lang === "zh-tw" || lang === "zh-hk") return `${lineKey}號線`;
  return `Line ${lineKey}`;
}

function calcDirection(from: StationKey, to: StationKey) {
  const fromIdx = LINE2_ORDER.indexOf(from);
  const toIdx = LINE2_ORDER.indexOf(to);
  const n = LINE2_ORDER.length;
  const clockwise = (toIdx - fromIdx + n) % n;
  const counter = (fromIdx - toIdx + n) % n;

  const towardKey: StationKey = clockwise <= counter ? "seongsu" : "cityhall";
  return {
    lineKey: "2" as const,
    towardKey,
  };
}

function copy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "Direction & Map Decoder",
      subtitle: "타기 직전 10초 체크 도구",
      s1: "Step 1",
      s2: "Step 2",
      from: "From",
      to: "To",
      fromPlaceholder: "예: 홍대입구 / Hongdae",
      toPlaceholder: "예: 성수 / Seongsu",
      result: "결과",
      towardSuffix: "방향",
      boardHintPrefix: "전광판에",
      boardHintSuffix: "표시 열차를 타세요.",
      line: "노선",
      anchor: "서울 지하철은 색보다 '종점 이름'이 더 중요합니다.",
      expressWarnTitle: "Express warning",
      expressWarnBody: "내릴 역이 열차 LED에 없으면 타지 마세요.",
      mapReadTitle: "How to read Seoul subway map",
      confuses: "What confuses you?",
      tabs: {
        color: "Color",
        direction: "Direction",
        express: "Express",
        exit: "Exit",
      },
      explain: {
        color: "노선 색은 힌트일 뿐입니다. 최종 판단은 종착역 이름으로 하세요.",
        direction: "같은 색. 반대 방향.",
        express: "급행/완행을 구분하세요. 내릴 역이 LED에 없으면 건너뜁니다.",
        exit: "대형역은 출구가 10개 이상입니다. 거리 이름보다 출구 번호가 더 중요합니다.",
      },
      diagramTitle: "Quick abstract view",
      directionNow: "지금 방향은",
      directionToward: "방향입니다.",
      invalid: "From/To를 정확히 입력하세요. (예: 홍대입구, Seongsu)",
    };
  }

  if (lang === "ja") {
    return {
      title: "方向チェック & 路線図デコーダー",
      subtitle: "乗車前10秒チェック",
      s1: "ステップ 1",
      s2: "ステップ 2",
      from: "出発駅",
      to: "到着駅",
      fromPlaceholder: "例: 弘大入口 / Hongdae",
      toPlaceholder: "例: 聖水 / Seongsu",
      result: "結果",
      towardSuffix: "方面",
      boardHintPrefix: "電光掲示板で",
      boardHintSuffix: "表示の列車に乗ってください。",
      line: "路線",
      anchor: "ソウル地下鉄は色より終点名が重要です。",
      expressWarnTitle: "急行注意",
      expressWarnBody: "降車駅が車内LEDに無ければ乗らないでください。",
      mapReadTitle: "ソウル地下鉄の見方",
      confuses: "何が分かりづらいですか？",
      tabs: {
        color: "色",
        direction: "方向",
        express: "急行",
        exit: "出口",
      },
      explain: {
        color: "路線の色はヒントです。最終判断は終点名でしてください。",
        direction: "同じ色でも逆方向があります。",
        express: "急行/各駅停車を確認してください。LEDに無い駅は通過の可能性があります。",
        exit: "大きい駅は出口が10以上あります。通り名より出口番号が重要です。",
      },
      diagramTitle: "方向の簡易表示",
      directionNow: "今の方向は",
      directionToward: "方面です。",
      invalid: "出発駅/到着駅を正確に入力してください。（例: 弘大入口, 聖水）",
    };
  }

  if (lang === "zh-cn") {
    return {
      title: "方向检查与路线图解读",
      subtitle: "上车前10秒检查",
      s1: "步骤 1",
      s2: "步骤 2",
      from: "出发站",
      to: "到达站",
      fromPlaceholder: "例: 弘大入口 / Hongdae",
      toPlaceholder: "例: 圣水 / Seongsu",
      result: "结果",
      towardSuffix: "方向",
      boardHintPrefix: "请乘坐站台屏幕显示",
      boardHintSuffix: "的列车。",
      line: "线路",
      anchor: "首尔地铁比颜色更重要的是终点站名。",
      expressWarnTitle: "急行提醒",
      expressWarnBody: "如果车内LED没有你的站名，就不要上车。",
      mapReadTitle: "首尔地铁图怎么读",
      confuses: "你最容易混淆的是？",
      tabs: {
        color: "颜色",
        direction: "方向",
        express: "急行",
        exit: "出口",
      },
      explain: {
        color: "线路颜色只是提示。最终判断请看终点站名。",
        direction: "同样颜色，也可能是反方向。",
        express: "先看急行/普通。LED没有你的站，可能会跳站。",
        exit: "大型车站常有10个以上出口。出口编号比街道名更重要。",
      },
      diagramTitle: "方向快速示意",
      directionNow: "你当前方向是",
      directionToward: "方向。",
      invalid: "请正确输入出发站/到达站（例如：弘大入口、圣水）。",
    };
  }

  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      title: "方向檢查與路線圖解讀",
      subtitle: "上車前10秒檢查",
      s1: "步驟 1",
      s2: "步驟 2",
      from: "出發站",
      to: "到達站",
      fromPlaceholder: "例: 弘大入口 / Hongdae",
      toPlaceholder: "例: 聖水 / Seongsu",
      result: "結果",
      towardSuffix: "方向",
      boardHintPrefix: "請搭乘月台螢幕顯示",
      boardHintSuffix: "的列車。",
      line: "路線",
      anchor: "首爾地鐵比顏色更重要的是終點站名。",
      expressWarnTitle: "急行提醒",
      expressWarnBody: "如果車內LED沒有你的站名，就不要上車。",
      mapReadTitle: "首爾地鐵圖怎麼看",
      confuses: "你最容易混淆的是？",
      tabs: {
        color: "顏色",
        direction: "方向",
        express: "急行",
        exit: "出口",
      },
      explain: {
        color: "路線顏色只是提示，最終判斷請看終點站名。",
        direction: "同樣顏色，也可能是相反方向。",
        express: "先看急行/普通。LED沒有你的站，可能會跳站。",
        exit: "大型車站常有10個以上出口。出口編號比街道名更重要。",
      },
      diagramTitle: "方向快速示意",
      directionNow: "你目前方向是",
      directionToward: "方向。",
      invalid: "請正確輸入出發站/到達站（例如：弘大入口、聖水）。",
    };
  }

  return {
    title: "Direction & Map Decoder",
    subtitle: "10-second check before boarding",
    s1: "Step 1",
    s2: "Step 2",
    from: "From",
    to: "To",
    fromPlaceholder: "Ex: Hongdae / 홍대입구",
    toPlaceholder: "Ex: Seongsu / 성수",
    result: "Result",
    towardSuffix: "direction",
    boardHintPrefix: "Board the train showing",
    boardHintSuffix: "on the platform sign.",
    line: "Line",
    anchor: "Always follow the final station name, not just the color.",
    expressWarnTitle: "Express warning",
    expressWarnBody: "If your station is NOT on the train LED, do not board.",
    mapReadTitle: "How to read Seoul subway map",
    confuses: "What confuses you?",
    tabs: {
      color: "Color",
      direction: "Direction",
      express: "Express",
      exit: "Exit",
    },
    explain: {
      color: "Line color is only a hint. Final decision should be terminal station name.",
      direction: "Same color. Opposite direction.",
      express: "Check express vs local. If your station is not on LED, it may be skipped.",
      exit: "Large stations can have 10+ exits. Exit number matters more than street name.",
    },
    diagramTitle: "Quick abstract view",
    directionNow: "Your direction is moving toward",
    directionToward: "",
    invalid: "Enter valid From and To (e.g., Hongdae, Seongsu, 홍대입구).",
  };
}

export function NowSubwayDirectionDecoder({ lang }: { lang: Lang }) {
  const c = copy(lang);
  const defaultFrom = lang === "ko" ? "홍대입구" : lang === "ja" ? "弘大入口" : lang === "zh-cn" ? "弘大入口" : (lang === "zh-tw" || lang === "zh-hk") ? "弘大入口" : "Hongdae";
  const defaultTo = lang === "ko" ? "성수" : lang === "ja" ? "聖水" : lang === "zh-cn" ? "圣水" : (lang === "zh-tw" || lang === "zh-hk") ? "聖水" : "Seongsu";
  const [from, setFrom] = useState<string>(defaultFrom);
  const [to, setTo] = useState<string>(defaultTo);
  const [tab, setTab] = useState<ConfuseKey>("direction");
  const stationOptions = useMemo(() => {
    const set = new Set<string>();
    STATIONS.forEach((station) => {
      [
        station.ko,
        station.en,
        station.ja,
        station["zh-cn"],
        station["zh-tw"],
        station["zh-hk"],
        ...station.aliases,
      ].forEach((value) => {
        const cleaned = value.trim();
        if (cleaned.length >= 2) set.add(cleaned);
      });
    });
    return Array.from(set);
  }, []);

  const result = useMemo(() => {
    const fromKey = toStationKey(from);
    const toKey = toStationKey(to);
    if (!fromKey || !toKey) return null;
    if (fromKey === toKey) return { lineKey: "2" as const, towardKey: fromKey };
    return calcDirection(fromKey, toKey);
  }, [from, to]);

  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{c.title}</h1>
        <p className="mt-2 text-sm font-semibold text-zinc-300">{c.subtitle}</p>
      </header>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <article>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">{c.s1}</p>
            <label className="mt-2 block text-sm font-black text-zinc-900">{c.from}</label>
            <input
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              list="line2-stations"
              className="mt-2 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-900"
              placeholder={c.fromPlaceholder}
            />
          </article>
          <article>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">{c.s2}</p>
            <label className="mt-2 block text-sm font-black text-zinc-900">{c.to}</label>
            <input
              value={to}
              onChange={(event) => setTo(event.target.value)}
              list="line2-stations"
              className="mt-2 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-900"
              placeholder={c.toPlaceholder}
            />
          </article>
        </div>

        <datalist id="line2-stations">
          {stationOptions.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>

        <div className="mt-4 rounded-2xl border border-zinc-900 bg-zinc-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-900">{c.result}</p>
          {result ? (
            <>
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-zinc-700">
                {c.line}:
                <span
                  className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-black"
                  style={{
                    backgroundColor: LINE_STYLES[result.lineKey].bg,
                    color: LINE_STYLES[result.lineKey].text,
                    borderColor: LINE_STYLES[result.lineKey].border,
                  }}
                >
                  {lineLabel(result.lineKey, lang)}
                </span>
              </p>
              <p className="mt-3 text-4xl font-black leading-none text-zinc-950 sm:text-5xl">
                {stationLabel(result.towardKey, lang)} {c.towardSuffix}
              </p>
              <p className="mt-3 text-sm font-bold text-zinc-700">
                {c.boardHintPrefix} <span className="text-zinc-950">{stationLabel(result.towardKey, lang)}</span> {c.boardHintSuffix}
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm font-semibold text-zinc-700">{c.invalid}</p>
          )}
        </div>
        <p className="mt-3 text-xs font-bold text-zinc-600">{c.anchor}</p>
      </section>

      <section className="rounded-2xl border border-zinc-300 bg-zinc-50 p-5">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">{c.expressWarnTitle}</h2>
        <p className="mt-2 text-sm font-semibold text-zinc-700">{c.expressWarnBody}</p>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">{c.mapReadTitle}</h2>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">{c.confuses}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["color", "direction", "express", "exit"] as const).map((item) => {
            const active = tab === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold ${active ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700"}`}
              >
                {c.tabs[item]}
              </button>
            );
          })}
        </div>

        <article className="mt-4 rounded-xl border border-zinc-200 p-4">
          <p className="text-sm font-semibold text-zinc-800">{c.explain[tab]}</p>
        </article>

        <article className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">{c.diagramTitle}</p>
          {result ? (
            <p className="mt-2 text-sm font-bold text-zinc-800">
              {c.directionNow} <span className="text-zinc-950">{stationLabel(result.towardKey, lang)}</span>{c.directionToward ? ` ${c.directionToward}` : ""}
            </p>
          ) : null}
          <p className="mt-2 text-sm font-bold text-zinc-800">
            <span
              className="mr-2 inline-flex rounded-full border px-2 py-0.5 text-xs font-black"
              style={{
                backgroundColor: LINE_STYLES["2"].bg,
                color: LINE_STYLES["2"].text,
                borderColor: LINE_STYLES["2"].border,
              }}
            >
              {lineLabel("2", lang)}
            </span>
            {stationLabel("hongdae", lang)} → {stationLabel("cityhall", lang)} → <span className="font-black text-zinc-950">{stationLabel("seongsu", lang)}</span>
          </p>
        </article>

      </section>
    </section>
  );
}
