"use client";

import { useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";

type Area = "hongdae" | "seongsu" | "bukchon" | "gangnam" | "euljiro" | "mangwon";
type Status = "hungry" | "tired" | "crowded" | "arrived";

function copy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "지금 어디로 가야 하지?",
      desc: "현재 상태 기준으로 바로 움직일 동선을 제안합니다.",
      area: "현재 지역",
      time: "현재 시간",
      state: "상태",
      output: "지금 할 행동",
      walk: "도보 대안",
      avoid: "피해야 할 것",
      states: {
        hungry: "배고픔",
        tired: "피곤함",
        crowded: "너무 붐빔",
        arrived: "방금 도착",
      },
      areas: {
        hongdae: "홍대",
        seongsu: "성수",
        bukchon: "북촌",
        gangnam: "강남",
        euljiro: "을지로",
        mangwon: "망원",
      },
    };
  }
  if (lang === "ja") {
    return {
      title: "今どこへ行くべき？",
      desc: "今の状態で、すぐ動ける導線を出します。",
      area: "現在エリア",
      time: "現在時刻",
      state: "状態",
      output: "今やる行動",
      walk: "徒歩代替",
      avoid: "避けること",
      states: {
        hungry: "お腹が空いた",
        tired: "疲れた",
        crowded: "混みすぎ",
        arrived: "到着したばかり",
      },
      areas: {
        hongdae: "ホンデ",
        seongsu: "ソンス",
        bukchon: "プクチョン",
        gangnam: "カンナム",
        euljiro: "ウルチロ",
        mangwon: "マンウォン",
      },
    };
  }
  if (lang === "zh-cn") {
    return {
      title: "我现在该去哪？",
      desc: "按你当前状态给出立刻可执行路线。",
      area: "当前区域",
      time: "当前时间",
      state: "状态",
      output: "现在就做",
      walk: "步行替代",
      avoid: "避免",
      states: {
        hungry: "饿了",
        tired: "累了",
        crowded: "太拥挤",
        arrived: "刚到",
      },
      areas: {
        hongdae: "弘大",
        seongsu: "圣水",
        bukchon: "北村",
        gangnam: "江南",
        euljiro: "乙支路",
        mangwon: "望远",
      },
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      title: "我現在該去哪？",
      desc: "依你目前狀態給可立刻執行的動線。",
      area: "目前區域",
      time: "目前時間",
      state: "狀態",
      output: "現在先做",
      walk: "步行替代",
      avoid: "避免",
      states: {
        hungry: "肚子餓",
        tired: "累了",
        crowded: "太擁擠",
        arrived: "剛到",
      },
      areas: {
        hongdae: "弘大",
        seongsu: "聖水",
        bukchon: "北村",
        gangnam: "江南",
        euljiro: "乙支路",
        mangwon: "望遠",
      },
    };
  }
  return {
    title: "What should I do right now?",
    desc: "Quick move plan from your current condition.",
    area: "Current area",
    time: "Current time",
    state: "Status",
    output: "Do this now",
    walk: "Walking option",
    avoid: "Avoid",
    states: {
      hungry: "Hungry",
      tired: "Tired",
      crowded: "Too crowded",
      arrived: "Just arrived",
    },
    areas: {
      hongdae: "Hongdae",
      seongsu: "Seongsu",
      bukchon: "Bukchon",
      gangnam: "Gangnam",
      euljiro: "Euljiro",
      mangwon: "Mangwon",
    },
  };
}

function areaTip(area: Area, lang: Lang) {
  const en: Record<Area, { walk: string; avoid: string }> = {
    hongdae: { walk: "Walk 5 minutes toward Yeonnam side.", avoid: "Do not queue over 20 minutes." },
    seongsu: { walk: "Walk toward Seoul Forest side streets.", avoid: "Skip the first viral cafe line." },
    bukchon: { walk: "Walk down to Samcheong-gil quietly.", avoid: "Avoid peak photo alleys after 11am." },
    gangnam: { walk: "Walk one block off Teheran main road.", avoid: "Avoid Line 2 transfers at peak hour." },
    euljiro: { walk: "Walk to side alleys behind main avenue.", avoid: "Avoid only following map top results." },
    mangwon: { walk: "Walk inside Mangwon market back lanes.", avoid: "Avoid riverfront at sunset peak." },
  };

  if (lang === "ko") {
    const ko: Record<Area, { walk: string; avoid: string }> = {
      hongdae: { walk: "연남 방향으로 5분만 걸어가세요.", avoid: "20분 이상 줄은 서지 마세요." },
      seongsu: { walk: "서울숲 방향 골목으로 이동하세요.", avoid: "첫 번째 바이럴 카페 줄은 피하세요." },
      bukchon: { walk: "삼청길 방향으로 내려가세요.", avoid: "11시 이후 메인 포토 골목은 피하세요." },
      gangnam: { walk: "테헤란로 메인에서 한 블록 벗어나세요.", avoid: "피크 시간 2호선 환승을 피하세요." },
      euljiro: { walk: "대로 뒤편 골목으로 바로 들어가세요.", avoid: "지도 상단 결과만 따라가지 마세요." },
      mangwon: { walk: "망원시장 안쪽 골목으로 이동하세요.", avoid: "일몰 시간 한강변 밀집 구간은 피하세요." },
    };
    return ko[area];
  }

  return en[area];
}

function buildActions(status: Status, hour: number, lang: Lang) {
  const evening = hour >= 18;

  if (lang === "ko") {
    if (status === "hungry") {
      return evening
        ? ["줄 긴 메인 맛집은 바로 스킵.", "골목 2번째 식당으로 이동.", "단품 1개 먼저 주문해 속도 확인."]
        : ["근처 10분 거리 식당 먼저 확정.", "브레이크 타임 여부 먼저 체크.", "대기 10분 넘으면 바로 이동."];
    }
    if (status === "tired") {
      return ["카페에서 25분만 쉬기.", "다음 목적지 1곳만 남기기.", "지하철 환승 대신 버스/택시 단거리 사용."];
    }
    if (status === "crowded") {
      return ["메인 거리에서 2블록 이탈.", "핫플 대기 줄은 즉시 포기.", "좁은 골목 지하 바/소형 매장으로 전환."];
    }
    return ["가장 중요한 1곳만 먼저 고르기.", "역 출구 방향을 먼저 확인.", "30분 내 끝낼 동선으로 시작."];
  }

  if (status === "hungry") {
    return evening
      ? ["Skip main line-up restaurants.", "Move to second-row side streets.", "Order one quick item first."]
      : ["Pick one place within 10 minutes.", "Check break time first.", "Move if wait exceeds 10 minutes."];
  }
  if (status === "tired") {
    return ["Sit for 25 minutes only.", "Keep one next stop, not three.", "Use short bus/taxi instead of extra transfer."];
  }
  if (status === "crowded") {
    return ["Leave main street by 2 blocks.", "Drop hot-place queues instantly.", "Switch to small basement/side venues."];
  }
  return ["Pick one priority stop first.", "Confirm station exit direction.", "Start with a 30-minute route."];
}

export function RightNowDecisionTool({ lang }: { lang: Lang }) {
  const c = copy(lang);
  const now = new Date();
  const [area, setArea] = useState<Area>("hongdae");
  const [timeValue, setTimeValue] = useState(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
  const [status, setStatus] = useState<Status>("crowded");

  const { actions, walk, avoid } = useMemo(() => {
    const hour = Number(timeValue.split(":")[0] || 12);
    const lines = buildActions(status, hour, lang);
    const tip = areaTip(area, lang);
    return { actions: lines, walk: tip.walk, avoid: tip.avoid };
  }, [area, timeValue, status, lang]);

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-7">
      <h2 className="text-2xl font-black tracking-tight text-zinc-950">{c.title}</h2>
      <p className="mt-2 text-sm text-zinc-600">{c.desc}</p>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.area}</p>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value as Area)}
            className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 outline-none"
          >
            <option value="hongdae">{c.areas.hongdae}</option>
            <option value="seongsu">{c.areas.seongsu}</option>
            <option value="bukchon">{c.areas.bukchon}</option>
            <option value="gangnam">{c.areas.gangnam}</option>
            <option value="euljiro">{c.areas.euljiro}</option>
            <option value="mangwon">{c.areas.mangwon}</option>
          </select>
        </label>

        <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.time}</p>
          <input
            type="time"
            value={timeValue}
            onChange={(e) => setTimeValue(e.target.value)}
            className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 outline-none"
          />
        </label>

        <label className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-600">{c.state}</p>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 outline-none"
          >
            <option value="hungry">{c.states.hungry}</option>
            <option value="tired">{c.states.tired}</option>
            <option value="crowded">{c.states.crowded}</option>
            <option value="arrived">{c.states.arrived}</option>
          </select>
        </label>
      </div>

      <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <h3 className="text-sm font-black text-zinc-900">{c.output}</h3>
        <ul className="mt-2 space-y-2 text-sm font-semibold text-zinc-800">
          {actions.map((line) => (
            <li key={line}>• {line}</li>
          ))}
        </ul>
        <p className="mt-3 text-sm font-semibold text-zinc-800">{c.walk}: {walk}</p>
        <p className="mt-1 text-sm font-semibold text-red-700">{c.avoid}: {avoid}</p>
      </div>
    </section>
  );
}
