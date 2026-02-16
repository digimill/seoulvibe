"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { TRAVEL_AREA_IDS, type TravelAreaId, getTravelAreas } from "@/lib/travel-ia";

type Scores = Record<TravelAreaId, number>;

type Localized = {
  en: string;
  ko?: string;
  ja?: string;
  "zh-cn"?: string;
  "zh-tw"?: string;
  "zh-hk"?: string;
};

type Option = {
  id: string;
  label: Localized;
  explain: Localized;
  weights: Partial<Scores>;
};

type Question = {
  id: string;
  title: Localized;
  options: Option[];
};

const QUIZ: Question[] = [
  {
    id: "vibe",
    title: {
      en: "What matters most for this trip?",
      ko: "이번 여행에서 가장 중요한 것은?",
      ja: "今回の旅行で最も重視することは？",
      "zh-cn": "这次旅行最重要的是什么？",
      "zh-tw": "這次旅行最重要的是什麼？",
      "zh-hk": "今次旅行最重要係咩？",
    },
    options: [
      {
        id: "nightlife",
        label: {
          en: "Nightlife and late food",
          ko: "야간 활동과 늦은 식사",
          ja: "夜の街と深夜ごはん",
          "zh-cn": "夜生活和深夜餐饮",
          "zh-tw": "夜生活與深夜餐飲",
          "zh-hk": "夜生活同宵夜",
        },
        explain: {
          en: "You prioritized nightlife and late food.",
          ko: "야간 활동과 늦은 식사를 우선으로 선택했습니다.",
          ja: "夜の行動と遅い食事を重視しました。",
          "zh-cn": "你优先了夜生活和深夜餐饮。",
          "zh-tw": "你優先了夜生活與深夜餐飲。",
          "zh-hk": "你優先咗夜生活同宵夜。",
        },
        weights: { hongdae: 4, itaewon: 3, myeongdong: 1 },
      },
      {
        id: "comfort",
        label: {
          en: "Comfort, hotels, and stability",
          ko: "숙소 퀄리티와 안정감",
          ja: "快適さ・ホテル品質・安定感",
          "zh-cn": "舒适度、酒店品质、稳定性",
          "zh-tw": "舒適度、飯店品質與穩定性",
          "zh-hk": "舒適、酒店質素同穩定性",
        },
        explain: {
          en: "You preferred stable comfort and hotel consistency.",
          ko: "숙소 품질과 안정적인 동선을 선호했습니다.",
          ja: "安定した快適さとホテル品質を優先しました。",
          "zh-cn": "你偏好稳定舒适和酒店一致性。",
          "zh-tw": "你偏好穩定舒適與飯店一致性。",
          "zh-hk": "你偏好穩定舒適同酒店一致性。",
        },
        weights: { gangnam: 4, jamsil: 3, myeongdong: 1 },
      },
      {
        id: "trendy",
        label: {
          en: "Cafes, design, and trend spots",
          ko: "카페/디자인/트렌드",
          ja: "カフェ・デザイン・トレンド",
          "zh-cn": "咖啡店、设计与潮流点",
          "zh-tw": "咖啡店、設計與潮流點",
          "zh-hk": "Cafe、設計同潮流點",
        },
        explain: {
          en: "You picked trend discovery and daytime exploration.",
          ko: "트렌드 탐색과 낮 중심 일정을 선택했습니다.",
          ja: "トレンド発見と昼の行動を重視しました。",
          "zh-cn": "你选择了潮流探索和白天活动。",
          "zh-tw": "你選擇了潮流探索與白天活動。",
          "zh-hk": "你揀咗潮流探索同日間活動。",
        },
        weights: { seongsu: 4, hongdae: 2, jamsil: 1 },
      },
      {
        id: "simple",
        label: {
          en: "First-time convenience",
          ko: "첫 여행 동선의 단순함",
          ja: "初旅行での分かりやすさ",
          "zh-cn": "首次旅行的便利性",
          "zh-tw": "首次旅行的便利性",
          "zh-hk": "第一次去嘅便利性",
        },
        explain: {
          en: "You prioritized first-time convenience and simple movement.",
          ko: "첫 방문 기준의 단순한 이동 동선을 우선했습니다.",
          ja: "初訪問向けの分かりやすい動線を優先しました。",
          "zh-cn": "你优先了首访便利和简单动线。",
          "zh-tw": "你優先了首訪便利與簡單動線。",
          "zh-hk": "你優先咗首訪便利同簡單動線。",
        },
        weights: { myeongdong: 4, hongdae: 2, jamsil: 1 },
      },
    ],
  },
  {
    id: "sleep",
    title: {
      en: "How important is quiet sleep?",
      ko: "숙소에서 조용함은 얼마나 중요한가요?",
      ja: "静かな睡眠はどれくらい重要ですか？",
      "zh-cn": "安静睡眠有多重要？",
      "zh-tw": "安靜睡眠有多重要？",
      "zh-hk": "安靜瞓覺有幾重要？",
    },
    options: [
      {
        id: "very",
        label: {
          en: "Very important",
          ko: "매우 중요",
          ja: "とても重要",
          "zh-cn": "非常重要",
          "zh-tw": "非常重要",
          "zh-hk": "非常重要",
        },
        explain: {
          en: "You need quieter nights for recovery.",
          ko: "휴식을 위해 야간 소음이 낮은 지역이 필요합니다.",
          ja: "休息のため夜間の静かさを重視しています。",
          "zh-cn": "你需要更安静的夜间环境来休息。",
          "zh-tw": "你需要更安靜的夜間環境來休息。",
          "zh-hk": "你需要更安靜嘅夜晚環境休息。",
        },
        weights: { jamsil: 4, gangnam: 2, seongsu: 1 },
      },
      {
        id: "balanced",
        label: {
          en: "Balanced",
          ko: "적당히 균형",
          ja: "バランス重視",
          "zh-cn": "平衡就好",
          "zh-tw": "平衡即可",
          "zh-hk": "平衡就得",
        },
        explain: {
          en: "You want a balanced mix of activity and rest.",
          ko: "활동성과 휴식의 균형을 원합니다.",
          ja: "活動と休息のバランスを重視しています。",
          "zh-cn": "你希望活动与休息保持平衡。",
          "zh-tw": "你希望活動與休息保持平衡。",
          "zh-hk": "你想活動同休息平衡。",
        },
        weights: { seongsu: 2, gangnam: 2, myeongdong: 2 },
      },
      {
        id: "dontcare",
        label: {
          en: "I can handle noise",
          ko: "소음 감수 가능",
          ja: "多少うるさくてもOK",
          "zh-cn": "能接受噪音",
          "zh-tw": "可接受噪音",
          "zh-hk": "接受到嘈音",
        },
        explain: {
          en: "You can tolerate louder nightlife zones.",
          ko: "야간 소음이 큰 지역도 감수 가능합니다.",
          ja: "夜のにぎやかさを許容できます。",
          "zh-cn": "你可以接受更热闹的夜间区域。",
          "zh-tw": "你可以接受更熱鬧的夜間區域。",
          "zh-hk": "你可以接受夜晚更熱鬧嘅區域。",
        },
        weights: { hongdae: 3, itaewon: 3 },
      },
    ],
  },
  {
    id: "airport",
    title: {
      en: "Airport transfer priority?",
      ko: "공항 이동 단순성은 얼마나 중요합니까?",
      ja: "空港移動の分かりやすさはどれくらい重要ですか？",
      "zh-cn": "机场往返的简洁度有多重要？",
      "zh-tw": "機場往返的簡潔度有多重要？",
      "zh-hk": "機場往返簡單程度有幾重要？",
    },
    options: [
      {
        id: "easy",
        label: {
          en: "As simple as possible",
          ko: "최대한 단순하게",
          ja: "できるだけシンプル",
          "zh-cn": "越简单越好",
          "zh-tw": "越簡單越好",
          "zh-hk": "越簡單越好",
        },
        explain: {
          en: "You want easy airport routes with less transfer stress.",
          ko: "환승 스트레스가 적은 공항 동선을 원합니다.",
          ja: "乗換ストレスの少ない空港動線を重視しています。",
          "zh-cn": "你希望机场动线简单、换乘压力小。",
          "zh-tw": "你希望機場動線簡單、換乘壓力小。",
          "zh-hk": "你想機場動線簡單、轉車壓力細。",
        },
        weights: { hongdae: 4, myeongdong: 3 },
      },
      {
        id: "ok-transfer",
        label: {
          en: "One transfer is okay",
          ko: "환승 1회는 괜찮음",
          ja: "1回乗換ならOK",
          "zh-cn": "可接受一次换乘",
          "zh-tw": "可接受一次換乘",
          "zh-hk": "接受一次轉車",
        },
        explain: {
          en: "You can trade some transfer complexity for neighborhood fit.",
          ko: "지역 적합도가 맞다면 환승 1회는 감수 가능합니다.",
          ja: "エリア適合のためなら1回乗換を許容できます。",
          "zh-cn": "你愿意为更合适的区域接受一次换乘。",
          "zh-tw": "你願意為更合適的區域接受一次換乘。",
          "zh-hk": "為咗更啱你嘅區域，你接受一次轉車。",
        },
        weights: { gangnam: 2, seongsu: 2, jamsil: 2, itaewon: 2 },
      },
      {
        id: "not-important",
        label: {
          en: "Not a big factor",
          ko: "크게 중요하지 않음",
          ja: "あまり重視しない",
          "zh-cn": "不是关键因素",
          "zh-tw": "不是關鍵因素",
          "zh-hk": "唔係關鍵因素",
        },
        explain: {
          en: "You prioritize local fit over airport convenience.",
          ko: "공항 편의보다 지역 궁합을 더 중요하게 봅니다.",
          ja: "空港利便性より滞在エリアの相性を優先しています。",
          "zh-cn": "你更看重区域匹配，而非机场便利。",
          "zh-tw": "你更看重區域匹配，而非機場便利。",
          "zh-hk": "你更重視區域匹配，多過機場便利。",
        },
        weights: { seongsu: 1, gangnam: 1, itaewon: 1, jamsil: 1 },
      },
    ],
  },
  {
    id: "party",
    title: {
      en: "How often will you go out at night?",
      ko: "밤에 외출하는 빈도는?",
      ja: "夜に出かける頻度は？",
      "zh-cn": "夜间外出频率？",
      "zh-tw": "夜間外出頻率？",
      "zh-hk": "夜晚外出頻率？",
    },
    options: [
      {
        id: "most-nights",
        label: {
          en: "Most nights",
          ko: "거의 매일",
          ja: "ほぼ毎晩",
          "zh-cn": "大多数晚上",
          "zh-tw": "大多數晚上",
          "zh-hk": "大部分夜晚",
        },
        explain: {
          en: "Frequent night-outs favor high-energy bases.",
          ko: "야간 외출 빈도가 높아 고에너지 베이스가 유리합니다.",
          ja: "夜の外出が多いため、エネルギーの高い拠点が合います。",
          "zh-cn": "高频夜间活动更适合高能量据点。",
          "zh-tw": "高頻夜間活動更適合高能量據點。",
          "zh-hk": "高頻夜晚活動更適合高能量據點。",
        },
        weights: { hongdae: 4, itaewon: 4 },
      },
      {
        id: "sometimes",
        label: {
          en: "Sometimes",
          ko: "가끔",
          ja: "ときどき",
          "zh-cn": "偶尔",
          "zh-tw": "偶爾",
          "zh-hk": "間中",
        },
        explain: {
          en: "You need occasional night access without full party density.",
          ko: "상시 파티권역이 아니라도 가끔 밤 동선이 필요합니다.",
          ja: "常時ナイトゾーンでなくても、時々夜動線が必要です。",
          "zh-cn": "你需要偶尔夜间活动，但不需要全天候派对密度。",
          "zh-tw": "你需要偶爾夜間活動，但不需要全天候派對密度。",
          "zh-hk": "你需要間中夜間活動，但唔使全時段派對密度。",
        },
        weights: { myeongdong: 2, seongsu: 2, gangnam: 2 },
      },
      {
        id: "rarely",
        label: {
          en: "Rarely",
          ko: "거의 없음",
          ja: "ほとんどない",
          "zh-cn": "很少",
          "zh-tw": "很少",
          "zh-hk": "好少",
        },
        explain: {
          en: "Lower nightlife frequency fits calmer districts.",
          ko: "야간 빈도가 낮아 상대적으로 조용한 지역이 맞습니다.",
          ja: "夜の行動が少ないため、落ち着いた地域が向いています。",
          "zh-cn": "夜间活动少，更适合安静区域。",
          "zh-tw": "夜間活動少，更適合安靜區域。",
          "zh-hk": "夜晚活動少，更適合寧靜區域。",
        },
        weights: { jamsil: 3, gangnam: 2 },
      },
    ],
  },
  {
    id: "group",
    title: {
      en: "Who are you traveling with?",
      ko: "누구와 함께 여행하나요?",
      ja: "誰と旅行しますか？",
      "zh-cn": "你和谁一起旅行？",
      "zh-tw": "你和誰一起旅行？",
      "zh-hk": "你同邊個一齊旅行？",
    },
    options: [
      {
        id: "solo-friends",
        label: {
          en: "Solo or friends",
          ko: "혼자 또는 친구",
          ja: "ひとり/友人",
          "zh-cn": "独自或朋友",
          "zh-tw": "獨旅或朋友",
          "zh-hk": "自己或朋友",
        },
        explain: {
          en: "Your group style favors social and flexible areas.",
          ko: "여행 구성상 소셜하고 유연한 지역이 잘 맞습니다.",
          ja: "同行スタイル的に社交的で柔軟なエリアが合います。",
          "zh-cn": "你的同行风格更适合社交和灵活区域。",
          "zh-tw": "你的同行風格更適合社交與靈活區域。",
          "zh-hk": "你嘅同行風格更啱社交同彈性區域。",
        },
        weights: { hongdae: 3, seongsu: 2, itaewon: 2 },
      },
      {
        id: "couple",
        label: {
          en: "Couple",
          ko: "커플",
          ja: "カップル",
          "zh-cn": "情侣",
          "zh-tw": "情侶",
          "zh-hk": "情侶",
        },
        explain: {
          en: "You want balanced pace and atmosphere for two.",
          ko: "2인 여행 기준의 분위기와 동선 균형이 중요합니다.",
          ja: "2人旅向けに雰囲気と動線のバランスを重視しています。",
          "zh-cn": "你更重视双人行程的节奏和氛围平衡。",
          "zh-tw": "你更重視雙人行程的節奏與氛圍平衡。",
          "zh-hk": "你更重視二人行程嘅節奏同氛圍平衡。",
        },
        weights: { seongsu: 3, gangnam: 2, jamsil: 2 },
      },
      {
        id: "family",
        label: {
          en: "Family or mixed ages",
          ko: "가족 또는 다양한 연령",
          ja: "家族/幅広い年齢",
          "zh-cn": "家庭或多年龄层",
          "zh-tw": "家庭或多年齡層",
          "zh-hk": "家庭或唔同年齡層",
        },
        explain: {
          en: "You need calmer logistics and predictable comfort.",
          ko: "가족 동선과 예측 가능한 편의성이 중요합니다.",
          ja: "家族動線と予測しやすい快適さが重要です。",
          "zh-cn": "你需要更稳妥的动线和可预期的舒适度。",
          "zh-tw": "你需要更穩妥的動線與可預期的舒適度。",
          "zh-hk": "你需要更穩陣嘅動線同可預期舒適度。",
        },
        weights: { jamsil: 4, myeongdong: 2, gangnam: 2 },
      },
    ],
  },
];

function t(value: Localized, lang: Lang): string {
  return value[lang] ?? value.en;
}

function initScores(): Scores {
  return {
    hongdae: 0,
    myeongdong: 0,
    gangnam: 0,
    seongsu: 0,
    itaewon: 0,
    jamsil: 0,
  };
}

function getCopy(lang: Lang) {
  if (lang === "ko") {
    return {
      title: "숙소 위치 매칭",
      lead: "질문 5개로 당신에게 맞는 숙소 동네를 먼저 고릅니다.",
      progress: "진행",
      resultTitle: "추천 결과",
      reset: "다시 선택",
      score: "매치 점수",
      why: "왜 이 지역인가",
      caution: "주의 포인트",
      openArea: "지역 판단 가이드 보기",
      openNow: "여행 중 해결 도구 보기",
      empty: "질문에 답하면 결과가 나옵니다.",
    };
  }
  if (lang === "ja") {
    return {
      title: "宿泊エリアマッチング",
      lead: "5つの質問であなたに合う滞在エリアを提案します。",
      progress: "進行",
      resultTitle: "おすすめ結果",
      reset: "リセット",
      score: "マッチスコア",
      why: "このエリアを推す理由",
      caution: "注意ポイント",
      openArea: "エリア判断ガイド",
      openNow: "今すぐ解決へ",
      empty: "回答すると結果が表示されます。",
    };
  }
  if (lang === "zh-cn") {
    return {
      title: "住宿区域匹配",
      lead: "回答5个问题，快速匹配更适合你的住宿区域。",
      progress: "进度",
      resultTitle: "推荐结果",
      reset: "重置",
      score: "匹配分数",
      why: "推荐理由",
      caution: "注意点",
      openArea: "打开区域判断指南",
      openNow: "去即时解决",
      empty: "回答问题后会显示结果。",
    };
  }
  if (lang === "zh-tw" || lang === "zh-hk") {
    return {
      title: "住宿區域配對",
      lead: "回答5個問題，快速配對更適合你的住宿區域。",
      progress: "進度",
      resultTitle: "推薦結果",
      reset: "重設",
      score: "配對分數",
      why: "推薦原因",
      caution: "注意點",
      openArea: "開啟區域判斷指南",
      openNow: "前往即時解決",
      empty: "回答問題後會顯示結果。",
    };
  }

  return {
    title: "Where To Stay Matcher",
    lead: "Answer 5 quick questions and get neighborhood-level recommendations.",
    progress: "Progress",
    resultTitle: "Top matches",
    reset: "Reset answers",
    score: "Match score",
    why: "Why this area",
    caution: "Watch-out",
    openArea: "Open area guide",
    openNow: "Open live fixes",
    empty: "Answer questions to see results.",
  };
}

export function WhereToStayMatcher({ lang }: { lang: Lang }) {
  const areas = useMemo(() => getTravelAreas(lang), [lang]);
  const c = getCopy(lang);
  const questions = useMemo(
    () => QUIZ.map((question) => ({ ...question, titleText: t(question.title, lang), optionsText: question.options.map((option) => ({ ...option, labelText: t(option.label, lang), explainText: t(option.explain, lang) })) })),
    [lang],
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const scoreResult = useMemo(() => {
    const scores = initScores();
    const reasonsByArea: Record<TravelAreaId, Array<{ weight: number; text: string }>> = {
      hongdae: [],
      myeongdong: [],
      gangnam: [],
      seongsu: [],
      itaewon: [],
      jamsil: [],
    };

    questions.forEach((question) => {
      const answerId = answers[question.id];
      if (!answerId) return;
      const picked = question.optionsText.find((option) => option.id === answerId);
      if (!picked) return;

      TRAVEL_AREA_IDS.forEach((id) => {
        const w = picked.weights[id] ?? 0;
        scores[id] += w;
        if (w > 0) reasonsByArea[id].push({ weight: w, text: picked.explainText });
      });
    });

    const ranking = areas
      .map((area) => ({
        ...area,
        score: scores[area.id],
        reasons: reasonsByArea[area.id].sort((a, b) => b.weight - a.weight).map((item) => item.text),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const serialized = TRAVEL_AREA_IDS.map((id) => `${id}:${scores[id]}`).join(",");

    return { ranking, serialized };
  }, [answers, areas, questions]);

  const answeredCount = Object.keys(answers).length;
  const completion = Math.round((answeredCount / questions.length) * 100);

  return (
    <section className="rounded-3xl border border-zinc-900 bg-white p-5 sm:p-7">
      <h1 className="text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl">{c.title}</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-700">{c.lead}</p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-600">{c.progress}: {completion}%</p>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          {questions.map((question) => (
            <article key={question.id} className="rounded-2xl border border-zinc-200 p-4">
              <h2 className="text-sm font-black text-zinc-950">{question.titleText}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {question.optionsText.map((option) => {
                  const selected = answers[question.id] === option.id;
                  return (
                    <button
                      type="button"
                      key={option.id}
                      onClick={() => {
                        setAnswers((prev) => ({ ...prev, [question.id]: option.id }));
                      }}
                      className={`rounded-full border px-3 py-1.5 text-xs font-bold ${selected ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700"}`}
                    >
                      {option.labelText}
                    </button>
                  );
                })}
              </div>
            </article>
          ))}

          <button
            type="button"
            onClick={() => setAnswers({})}
            className="rounded-full border border-zinc-900 px-4 py-2 text-xs font-bold text-zinc-900"
          >
            {c.reset}
          </button>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-900">{c.resultTitle}</h2>

          {answeredCount === 0 ? (
            <p className="mt-3 text-sm text-zinc-600">{c.empty}</p>
          ) : (
            <div className="mt-3 space-y-3">
              {scoreResult.ranking.map((area) => (
                <article key={area.id} className="rounded-xl border border-zinc-200 bg-white p-3">
                  <p className="text-base font-black text-zinc-950">{area.name}</p>
                  <p className="mt-1 text-xs font-semibold text-zinc-600">{c.score}: {area.score}</p>
                  <p className="mt-2 text-sm text-zinc-700">{area.oneLineConclusion}</p>
                  <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-zinc-900">{c.why}</p>
                  <ul className="mt-1 space-y-1 text-xs text-zinc-700">
                    {(area.reasons.length > 0 ? area.reasons.slice(0, 2) : [area.summary]).map((reason) => (
                      <li key={reason}>- {reason}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-zinc-900">{c.caution}</p>
                  <p className="mt-1 text-xs text-zinc-700">- {area.avoidIf[0]}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                    <Link href={`/${lang}/areas/${area.id}?ms=${encodeURIComponent(scoreResult.serialized)}`} className="rounded-full border border-zinc-900 px-3 py-1 text-zinc-900">
                      {c.openArea}
                    </Link>
                    <Link href={`/${lang}/now`} className="rounded-full border border-zinc-300 px-3 py-1 text-zinc-700">
                      {c.openNow}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
