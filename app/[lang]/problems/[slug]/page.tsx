import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { getProblemQuestion, getProblemSeoBySlug, problemSeoItems } from "@/lib/problem-seo";
import { isLang, type Lang } from "@/lib/i18n";
import { toPerplexitySearchUrl } from "@/lib/spot-picks";

type PageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

type LocalizedProblemBlock = {
  shortAnswer: [string, string, string];
  why: string;
  steps: string[];
  backup: string[];
  mainFixLabel: string;
};

const NO_OVERRIDE_SLUGS = new Set([
  "do-korean-cafes-accept-foreign-credit-cards",
  "is-line-2-confusing-for-tourists",
  "is-gangnam-crowded-at-night",
  "best-olive-young-products-for-first-time-visitors",
  "what-should-i-buy-at-olive-young-under-50",
  "can-tourists-get-tax-refund-at-olive-young",
  "is-olive-young-cheaper-than-duty-free",
  "is-taxi-from-airport-expensive-in-seoul",
]);

function copy(lang: Lang) {
  if (lang === "ko") return { a: "짧은 답", b: "왜 생기나", c: "지금 할 일", d: "백업 플랜", e: "메인 해결 페이지", all: "20개 문제 모두 보기" };
  if (lang === "ja") return { a: "短い回答", b: "なぜ起きる", c: "やること", d: "バックアップ", e: "メイン解決ページ", all: "20ページを一覧で見る" };
  if (lang === "zh-cn") return { a: "简短结论", b: "为什么会发生", c: "现在怎么做", d: "备用方案", e: "主解决页", all: "查看全部 20 个问题" };
  if (lang === "zh-tw" || lang === "zh-hk") return { a: "簡短結論", b: "為什麼會發生", c: "現在怎麼做", d: "備用方案", e: "主解決頁", all: "查看全部 20 個問題" };
  return { a: "Short direct answer", b: "Why it happens", c: "What to do step by step", d: "Quick backup plan", e: "Link to main Fix page", all: "View all 20 problem pages" };
}

function getProblemKey(slug: string): "payment" | "tmoney" | "subway" | "crowd" | "olive" | "airport" {
  if (slug === "how-much-tmoney-should-a-tourist-load") return "tmoney";
  if (slug === "best-way-to-get-from-incheon-to-hongdae" || slug === "is-taxi-from-airport-expensive-in-seoul") return "airport";
  if (slug.includes("subway") || slug.includes("line-2") || slug.includes("hongdae-from-airport")) return "subway";
  if (slug.includes("crowd") || slug.includes("hongdae") || slug.includes("bukchon") || slug.includes("gangnam")) return "crowd";
  if (slug.includes("olive-young")) return "olive";
  return "payment";
}

function getLocalizedProblemBlock(slug: string, lang: Lang): LocalizedProblemBlock | null {
  if (NO_OVERRIDE_SLUGS.has(slug)) return null;
  if (lang === "en") return null;
  const key = getProblemKey(slug);

  const dict: Record<Exclude<Lang, "en">, Record<ReturnType<typeof getProblemKey>, LocalizedProblemBlock>> = {
    ko: {
      payment: {
        shortAnswer: ["키오스크보다 카운터 결제가 더 안정적입니다.", "한 번 실패하면 같은 기기에서 반복하지 마세요.", "탭 결제 -> 카드 변경 -> 카운터 이동 순서로 처리하세요."],
        why: "키오스크는 로컬 사용자 기준으로 설계돼서 언어/결제 예외 처리가 약합니다.",
        steps: ["탭 결제를 먼저 시도하세요.", "실패하면 다른 카드로 즉시 전환하세요.", "직원에게 카운터 결제를 요청하세요."],
        backup: ["같은 브랜드 다른 지점으로 이동", "편의점 ATM 현금 소액 확보"],
        mainFixLabel: "키오스크 결제 문제 해결 가이드",
      },
      tmoney: {
        shortAnswer: ["3-4일이면 2만5천~3만5천원부터 시작하세요.", "잔액 7천~1만원은 바닥선으로 유지하세요.", "출퇴근 피크 전에 충전하세요."],
        why: "잔액을 너무 적게 잡으면 역 안에서 반복 충전으로 시간이 무너집니다.",
        steps: ["숙박일수 기준으로 1차 충전", "하루 시작/종료 시 잔액 확인", "바닥선 밑으로 내려가기 전에 충전"],
        backup: ["혼잡 역은 피하고 다음 역에서 충전", "급하면 택시 예산 소액 확보"],
        mainFixLabel: "티머니 충전 기준 가이드",
      },
      subway: {
        shortAnswer: ["노선 색보다 종착역 이름을 먼저 보세요.", "2호선은 양방향이라 실수가 잦습니다.", "헷갈리면 개찰구 전에 바로 물어보세요."],
        why: "색만 보고 타면 방향을 놓치기 쉽고, 환승 구간에서 실수 시간이 커집니다.",
        steps: ["플랫폼 들어가기 전 종착역 재확인", "방향이 애매하면 역무원에게 질문", "잘못 탔다면 다음 역에서 바로 반대편 환승"],
        backup: ["짧은 거리는 버스/택시로 우회", "피크 시간엔 동선 자체를 한 번 줄이기"],
        mainFixLabel: "지하철 방향 실수 복구 가이드",
      },
      crowd: {
        shortAnswer: ["같은 블록에서 버티지 마세요.", "두 블록만 벗어나도 체감이 크게 달라집니다.", "대기줄 길어지면 즉시 백업 동선으로 전환하세요."],
        why: "핫플과 주 출구가 같은 시간대에 겹치면서 인파가 한 번에 쏠립니다.",
        steps: ["메인 스트립에서 바로 이탈", "옆 거리/옆 역으로 분산 이동", "핵심 일정 1개만 남기고 재정렬"],
        backup: ["다음 날 오전으로 시간 이동", "한 곳 포기하고 복귀 시간 확보"],
        mainFixLabel: "혼잡 탈출 가이드",
      },
      olive: {
        shortAnswer: ["처음 방문이면 기본 4종으로 끝내세요.", "30분 타이머를 걸고 움직이세요.", "유행템은 1개만 추가하세요."],
        why: "매장 정보량이 너무 많아 계획 없이 들어가면 시간과 예산이 동시에 무너집니다.",
        steps: ["클렌저-토너-마스크-립 먼저 담기", "영문 라벨 없는 제품은 뒤로 미루기", "결제 전 택스리펀/여권 확인"],
        backup: ["매장 혼잡하면 다른 지점으로 이동", "핵심 품목만 먼저 사고 종료"],
        mainFixLabel: "올리브영 30분 구매 가이드",
      },
      airport: {
        shortAnswer: ["기본은 AREX + 홍대입구역입니다.", "짐이 많거나 늦은 시간이면 버스/택시가 낫습니다.", "요금보다 피로도와 도착 시간을 같이 보세요."],
        why: "입국 직후 피로 상태에서 환승을 무리하면 작은 실수가 크게 번집니다.",
        steps: ["도착 시간과 짐 무게부터 체크", "AREX/버스/택시 중 하나만 빠르게 결정", "현장에서 헷갈리면 즉시 백업 수단으로 전환"],
        backup: ["일행과 택시 합승", "버스로 1차 이동 후 단거리 택시"],
        mainFixLabel: "공항-도심 이동 결정 가이드",
      },
    },
    ja: {
      payment: {
        shortAnswer: ["キオスクよりカウンター決済の方が安定します。", "1回失敗したら同じ端末で連打しない。", "タッチ -> 別カード -> カウンターの順で処理。"],
        why: "キオスクはローカル向け設計が多く、言語や決済例外に弱いです。",
        steps: ["まずタッチ決済を試す", "失敗したら別カードへ切替", "スタッフにカウンター決済を依頼"],
        backup: ["同チェーン別店舗へ移動", "コンビニATMで少額現金を確保"],
        mainFixLabel: "キオスク決済トラブル対処ガイド",
      },
      tmoney: {
        shortAnswer: ["3-4日ならまず 25,000-35,000ウォン。", "残高 7,000-10,000ウォンを下限に。", "通勤ピーク前にチャージ。"],
        why: "少額すぎるチャージは駅での再チャージ連打を生みます。",
        steps: ["滞在日数ベースで初回チャージ", "朝か夜に残高確認", "下限前に追加チャージ"],
        backup: ["混雑駅を避けて次駅でチャージ", "緊急用に短距離タクシー予算を確保"],
        mainFixLabel: "T-moneyチャージ基準ガイド",
      },
      subway: {
        shortAnswer: ["路線色より終点名を先に確認。", "2号線は両方向でミスしやすい。", "迷ったら改札前で質問。"],
        why: "色だけで判断すると方向を外しやすく、時間ロスが大きいです。",
        steps: ["ホーム前で終点名を再確認", "不安なら駅員に確認", "乗り間違えたら次駅で反対方向へ"],
        backup: ["短距離はバス/タクシーへ切替", "ピーク時間は移動本数を減らす"],
        mainFixLabel: "地下鉄方向ミス復旧ガイド",
      },
      crowd: {
        shortAnswer: ["同じブロックで粘らない。", "2ブロック外れるだけで楽になります。", "行列が伸びたら即バックアップへ。"],
        why: "人気スポットと主要出口に同時集中が起きます。",
        steps: ["まずメイン通りから離脱", "隣通り/隣駅へ移動", "優先1件だけ残して再編成"],
        backup: ["翌朝へ時間移動", "1スポット削って帰路を確保"],
        mainFixLabel: "混雑離脱ガイド",
      },
      olive: {
        shortAnswer: ["初回は基本4点で十分。", "30分タイマーで買う。", "流行枠は1点だけ追加。"],
        why: "情報量が多く、無計画だと時間と予算が崩れます。",
        steps: ["洗顔-化粧水-マスク-リップを先に確保", "英語ラベルなし商品は後回し", "会計前に免税とパスポート確認"],
        backup: ["混雑店なら別店舗へ移動", "必需品だけ買って終了"],
        mainFixLabel: "オリーブヤング30分購入ガイド",
      },
      airport: {
        shortAnswer: ["基本はAREX + 弘大入口駅。", "荷物が重い/深夜到着ならバスやタクシー。", "運賃だけでなく疲労も基準に。"],
        why: "到着直後は判断力が落ち、乗換ミスが増えます。",
        steps: ["到着時刻と荷物量を確認", "AREX/バス/タクシーを即決", "迷ったらバックアップ交通へ切替"],
        backup: ["複数人ならタクシー割り勘", "バスで近くまで行き短距離タクシー"],
        mainFixLabel: "空港-市内移動判断ガイド",
      },
    },
    "zh-cn": {
      payment: {
        shortAnswer: ["柜台刷卡通常比自助机稳定。", "失败一次就别在同一机器反复重试。", "按 tap -> 换卡 -> 去柜台 的顺序处理。"],
        why: "很多自助机按本地用户流程设计，对语言和外卡异常处理较弱。",
        steps: ["先试感应支付", "失败就立刻换卡", "直接请店员走柜台结算"],
        backup: ["换同品牌其他门店", "在便利店 ATM 取少量现金"],
        mainFixLabel: "自助机支付故障处理指南",
      },
      tmoney: {
        shortAnswer: ["3-4 天先充 25,000-35,000 韩元。", "余额保持 7,000-10,000 韩元底线。", "避开通勤高峰再充值。"],
        why: "充得太少会在站内反复排队充值，直接拖慢行程。",
        steps: ["按停留天数做首充", "早晚各看一次余额", "低于底线前就补充"],
        backup: ["拥挤站点改到下一站充值", "预留少量短程打车预算"],
        mainFixLabel: "T-money 充值基准指南",
      },
      subway: {
        shortAnswer: ["先看终点站名，不先看颜色。", "2号线双向循环，最容易坐反。", "不确定就先问再进站。"],
        why: "只看颜色很容易错方向，后续换乘会连续亏时间。",
        steps: ["进站前再核对终点名", "拿不准就问站务人员", "坐反了就在下一站反向换乘"],
        backup: ["短距离改公交/打车", "高峰时减少跨区跳转"],
        mainFixLabel: "地铁方向坐反恢复指南",
      },
      crowd: {
        shortAnswer: ["别硬挤同一街区。", "离开主街两条街体感就会好很多。", "排队拉长就立刻切备选路线。"],
        why: "网红点和主出口在同一时段叠加，拥堵会瞬间放大。",
        steps: ["先离开主街", "改走旁街或邻站", "只保留一个核心目的地"],
        backup: ["改到次日上午再去", "砍掉一个点保住返程节奏"],
        mainFixLabel: "拥挤撤离指南",
      },
      olive: {
        shortAnswer: ["第一次买就锁定基础 4 件。", "设置 30 分钟计时。", "网红尝试最多加 1 件。"],
        why: "货架信息太多，不设边界就会超时超预算。",
        steps: ["先拿洁面-化妆水-面膜-唇部", "没有英文标识的先跳过", "结账前确认退税和护照"],
        backup: ["太拥挤就换门店", "先买核心品马上结束"],
        mainFixLabel: "Olive Young 30 分钟采购指南",
      },
      airport: {
        shortAnswer: ["默认选 AREX 到弘大入口。", "行李多或太晚到就改巴士/出租车。", "别只看价格，要看体力和时间。"],
        why: "刚落地最疲劳，换乘失误成本会被放大。",
        steps: ["先看到达时间和行李量", "AREX/巴士/出租车三选一快速决策", "现场混乱就立刻切备选交通"],
        backup: ["多人拼车分摊费用", "先巴士到近点再短程打车"],
        mainFixLabel: "机场到市区决策指南",
      },
    },
    "zh-tw": {
      payment: {
        shortAnswer: ["櫃檯刷卡通常比自助機穩定。", "失敗一次就不要在同一機器重試太久。", "照 tap -> 換卡 -> 櫃檯 的順序處理。"],
        why: "很多自助機以本地使用流程設計，對語言與外卡例外處理較弱。",
        steps: ["先試感應支付", "失敗就立刻換卡", "直接請店員改櫃檯結帳"],
        backup: ["改去同品牌其他分店", "在便利店 ATM 先取少量現金"],
        mainFixLabel: "自助機付款故障處理指南",
      },
      tmoney: {
        shortAnswer: ["3-4 天先儲 25,000-35,000 韓元。", "餘額維持 7,000-10,000 韓元底線。", "避開通勤尖峰再加值。"],
        why: "加值太少會在站內反覆排隊，行程節奏會崩。",
        steps: ["按停留天數做首充", "每天早晚各看一次餘額", "低於底線前先補值"],
        backup: ["擁擠站改到下一站再加值", "預留短程計程車備用預算"],
        mainFixLabel: "T-money 儲值基準指南",
      },
      subway: {
        shortAnswer: ["先看終點站名，不先看顏色。", "2號線雙向循環，最容易搭反。", "不確定就先問再進站。"],
        why: "只看顏色很容易判錯方向，後續換乘會持續耗時。",
        steps: ["進站前再核對終點名", "不確定先問站務人員", "搭反就在下一站反向轉乘"],
        backup: ["短距離改搭公車/計程車", "尖峰時段減少跨區跳轉"],
        mainFixLabel: "地鐵搭反方向修正指南",
      },
      crowd: {
        shortAnswer: ["不要硬撐同一街區。", "離開主街兩個街區就會好很多。", "排隊一拉長就立刻切備案。"],
        why: "網紅點和主要出口在同時段疊加，擁擠會被放大。",
        steps: ["先離開主街", "改走旁街或鄰站", "只保留一個核心目的地"],
        backup: ["改到隔天上午再去", "刪掉一個點保住回程節奏"],
        mainFixLabel: "人潮撤離指南",
      },
      olive: {
        shortAnswer: ["第一次買就鎖定基礎 4 件。", "設定 30 分鐘計時。", "網紅嘗試最多加 1 件。"],
        why: "貨架資訊量過大，不設邊界就會超時超預算。",
        steps: ["先拿潔面-化妝水-面膜-唇部", "沒有英文標示的先跳過", "結帳前確認退稅與護照"],
        backup: ["太擠就換分店", "先買核心品就收手"],
        mainFixLabel: "Olive Young 30 分鐘採買指南",
      },
      airport: {
        shortAnswer: ["預設選 AREX 到弘大入口。", "行李重或太晚到就改巴士/計程車。", "不要只看票價，也要看體力和時間。"],
        why: "剛落地最疲累，轉乘失誤成本會被放大。",
        steps: ["先看抵達時間與行李量", "AREX/巴士/計程車三選一快速決定", "現場混亂就立刻切備援交通"],
        backup: ["多人可共乘分攤車資", "先搭巴士到近點再短程計程車"],
        mainFixLabel: "機場到市區決策指南",
      },
    },
    "zh-hk": {
      payment: {
        shortAnswer: ["櫃檯碌卡通常比自助機穩定。", "失敗一次就唔好喺同一部機狂試。", "跟住 tap -> 換卡 -> 去櫃檯 呢個次序做。"],
        why: "好多自助機係按本地人流程設計，對語言同外卡例外處理較弱。",
        steps: ["先試感應支付", "失敗就即刻換卡", "直接請店員轉櫃檯結帳"],
        backup: ["轉去同品牌另一間分店", "喺便利店 ATM 先攞少量現金"],
        mainFixLabel: "自助機付款故障處理指南",
      },
      tmoney: {
        shortAnswer: ["3-4 日先儲 25,000-35,000 韓元。", "餘額維持 7,000-10,000 韓元底線。", "避開返工放工高峰先加值。"],
        why: "儲得太少會喺站內重複排隊加值，行程會亂。",
        steps: ["按停留日數做首充", "每日朝早同夜晚各睇一次餘額", "未跌穿底線前先補值"],
        backup: ["太多人嘅站改去下一站加值", "預留短程的士預算"],
        mainFixLabel: "T-money 儲值基準指南",
      },
      subway: {
        shortAnswer: ["先睇終點站名，唔好淨係睇顏色。", "2號線雙向循環，最易搭錯。", "唔確定就入閘前先問。"],
        why: "只靠顏色好易判錯方向，之後轉車會連續浪費時間。",
        steps: ["入站前再核對終點名", "唔肯定就問站務員", "搭錯就下一站反方向轉乘"],
        backup: ["短距離改搭巴士/的士", "高峰時間減少跨區轉移"],
        mainFixLabel: "地鐵方向搭錯修正指南",
      },
      crowd: {
        shortAnswer: ["唔好硬撐喺同一條街。", "離開主街兩個街區已經會鬆好多。", "排隊一拉長就即刻轉備案。"],
        why: "網紅點同主要出口同時段重疊，迫爆會即刻放大。",
        steps: ["先離開主街", "轉去側街或隔籬站", "只留一個核心目的地"],
        backup: ["改第二朝早再去", "刪一個景點保住返程時間"],
        mainFixLabel: "人潮脫身指南",
      },
      olive: {
        shortAnswer: ["第一次買就鎖定基本 4 件。", "設 30 分鐘計時。", "網紅項目最多加 1 件。"],
        why: "貨架資訊太多，唔設界線就會超時同超預算。",
        steps: ["先拎潔面-化妝水-面膜-唇部", "冇英文標示嘅先略過", "埋單前確認退稅同護照"],
        backup: ["太迫就轉分店", "先買核心品就收手"],
        mainFixLabel: "Olive Young 30 分鐘採買指南",
      },
      airport: {
        shortAnswer: ["預設用 AREX 去弘大入口。", "行李多或太夜到就改巴士/的士。", "唔好只睇車費，要計埋體力同時間。"],
        why: "啱落機最攰，轉乘一錯就會放大成本。",
        steps: ["先睇到達時間同行李量", "AREX/巴士/的士三揀一快決定", "現場混亂就即刻轉備用交通"],
        backup: ["多人可夾的士分攤", "先巴士再短程的士"],
        mainFixLabel: "機場去市區決策指南",
      },
    },
  };

  return dict[lang][key];
}

function getSuggestedQueries(slug: string, lang: Lang): string[] {
  if (NO_OVERRIDE_SLUGS.has(slug)) {
    const item = getProblemSeoBySlug(slug);
    const q = item ? getProblemQuestion(item, lang) : slug.replaceAll("-", " ");
    if (lang === "ko") {
      return [`${q} 해결 순서`, `${q} 실전 팁`, `${q} 여행자 기준 체크리스트`];
    }
    return [`${q} quick steps`, `${q} practical tips`, `${q} traveler checklist`];
  }

  const key = getProblemKey(slug);
  const byLang: Record<Lang, Record<ReturnType<typeof getProblemKey>, string[]>> = {
    ko: {
      payment: ["서울 키오스크 해외카드 실패 대처 순서", "카운터 결제 요청할 때 가장 빠른 문장", "전화번호 입력 없이 결제하는 방법"],
      tmoney: ["티머니 일수별 권장 충전액", "출퇴근 피크 시간대 충전 피하는 방법", "티머니 잔액 부족 시 즉시 대안"],
      subway: ["2호선 반대방향 빠르게 구분하는 법", "홍대 가는 열차 종착역 확인 요령", "지하철 역 지나쳤을 때 손실 최소화"],
      crowd: ["홍대 인파 터졌을 때 즉시 우회 동선", "강남 저녁 혼잡 회피 이동법", "북촌 혼잡 시간대 대체 코스"],
      olive: ["올리브영 30분 구매 우선순위", "올리브영 택스리펀 실수 없는 절차", "올리브영에서 초보가 건너뛸 제품"],
      airport: ["인천공항에서 홍대까지 짐 많을 때 최적 이동", "공항택시 vs AREX 시간/비용 비교", "심야 입국 후 서울 이동 안전한 선택"],
    },
    en: {
      payment: ["foreign card rejected at seoul kiosk what to do first", "fast phrase to ask for counter payment in korea", "kiosk phone number prompt skip as tourist"],
      tmoney: ["how much t-money for 3 days in seoul", "best time to top up t-money to avoid queues", "what to do when t-money balance is too low"],
      subway: ["how to check subway direction in seoul line 2", "how to confirm final station before boarding seoul metro", "missed subway stop in korea fastest recovery"],
      crowd: ["hongdae crowd escape route right now", "gangnam peak crowd workaround at night", "bukchon backup plan when too crowded"],
      olive: ["olive young 30 minute shopping priority list", "olive young tax refund process for tourists", "what not to buy at olive young first trip"],
      airport: ["best transfer from incheon to hongdae with luggage", "airport taxi vs arex seoul time and cost", "late night arrival in seoul safest transport choice"],
    },
    ja: {
      payment: ["ソウルのキオスクで海外カードが失敗した時の手順", "カウンター決済を最短で頼む言い方", "電話番号入力をスキップして支払う方法"],
      tmoney: ["旅行日数別のT-moneyチャージ目安", "通勤ピークを避けるチャージ時間", "T-money残高不足の即時対処"],
      subway: ["2号線で逆方向を見分ける方法", "ホンデ行きの終点確認のコツ", "降りる駅を過ぎた時の最短復旧"],
      crowd: ["ホンデが混雑した時の退避ルート", "カンナム夜ピーク回避の移動法", "北村が混んだ時の代替コース"],
      olive: ["オリーブヤング30分の買い物優先順位", "オリーブヤング免税手続きの流れ", "初回で買わない方がいい商品"],
      airport: ["仁川空港からホンデまで荷物多めの最適移動", "空港タクシーとAREXの時間コスト比較", "深夜到着時の安全な市内移動"],
    },
    "zh-cn": {
      payment: ["首尔自助机外卡失败先做什么", "如何快速让店员改柜台付款", "韩国自助机手机号页面怎么跳过"],
      tmoney: ["游客在首尔3天T-money充多少", "避开高峰充值T-money的方法", "T-money余额不足怎么马上处理"],
      subway: ["首尔2号线怎么防止坐反方向", "上车前怎么确认终点站名", "韩国地铁坐过站最快怎么补救"],
      crowd: ["弘大太挤时立刻怎么撤离", "江南夜间高峰怎么绕开", "北村拥挤时替代路线"],
      olive: ["Olive Young 30分钟购买优先级", "Olive Young 退税流程游客版", "第一次去Olive Young哪些先别买"],
      airport: ["仁川到弘大行李多最省事方案", "机场出租车和AREX时间费用对比", "深夜抵达首尔怎么安全进城"],
    },
    "zh-tw": {
      payment: ["首爾自助機外卡失敗先做什麼", "怎樣快速請店員改櫃檯付款", "韓國自助機手機號頁面如何跳過"],
      tmoney: ["旅客在首爾3天T-money要儲多少", "避開尖峰加值T-money的方法", "T-money餘額不足怎麼即時處理"],
      subway: ["首爾2號線怎麼避免搭反方向", "上車前如何確認終點站名", "韓國地鐵坐過站最快補救方式"],
      crowd: ["弘大太擠時怎樣立即撤離", "江南夜間尖峰怎麼繞開", "北村擁擠時替代路線"],
      olive: ["Olive Young 30分鐘採買優先順序", "Olive Young 退稅流程旅客版", "第一次去Olive Young先別買什麼"],
      airport: ["仁川到弘大行李多最省事方案", "機場計程車和AREX時間費用比較", "深夜抵達首爾如何安全進城"],
    },
    "zh-hk": {
      payment: ["首爾自助機外卡失敗應該先做咩", "點樣最快叫店員轉櫃檯付款", "韓國自助機電話號碼頁點跳過"],
      tmoney: ["遊客喺首爾3日T-money儲幾多", "避開高峰加值T-money方法", "T-money餘額不足點即刻處理"],
      subway: ["首爾2號線點樣避免搭錯方向", "上車前點確認終點站名", "韓國地鐵坐過站最快補救"],
      crowd: ["弘大太逼時點即刻撤離", "江南夜晚高峰點繞開", "北村太多人時替代路線"],
      olive: ["Olive Young 30分鐘購物優先順序", "Olive Young退稅流程旅客版", "第一次去Olive Young邊啲先唔好買"],
      airport: ["仁川去弘大行李多最省事方案", "機場的士同AREX時間費用比較", "深夜到首爾點樣安全入市區"],
    },
  };

  return byLang[lang][key];
}

export async function generateStaticParams() {
  return problemSeoItems.flatMap((item) => [
    { lang: "en", slug: item.slug },
    { lang: "ko", slug: item.slug },
    { lang: "ja", slug: item.slug },
    { lang: "zh-cn", slug: item.slug },
    { lang: "zh-tw", slug: item.slug },
    { lang: "zh-hk", slug: item.slug },
  ]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang)) return {};
  const locale = lang as Lang;
  const item = getProblemSeoBySlug(slug);
  if (!item) return {};
  const localized = getLocalizedProblemBlock(item.slug, locale);
  return {
    title: getProblemQuestion(item, locale),
    description: (localized?.shortAnswer ?? item.shortAnswer).join(" "),
  };
}

export default async function Page({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!isLang(lang)) notFound();
  const locale = lang as Lang;
  const c = copy(locale);
  const item = getProblemSeoBySlug(slug);
  if (!item) notFound();
  const question = getProblemQuestion(item, locale);
  const localized = getLocalizedProblemBlock(item.slug, locale);
  const shortAnswer = localized?.shortAnswer ?? item.shortAnswer;
  const why = localized?.why ?? item.why;
  const steps = localized?.steps ?? item.steps;
  const backup = localized?.backup ?? item.backup;
  const mainFixLabel = localized?.mainFixLabel ?? item.mainFixLabel;
  const suggestedQueries = getSuggestedQueries(item.slug, locale);
  const quickAi =
    locale === "ko"
      ? "심화 질문 바로 묻기"
      : locale === "ja"
        ? "詳細質問をすぐ検索"
        : locale === "zh-cn"
          ? "马上查深度问题"
          : locale === "zh-tw" || locale === "zh-hk"
            ? "立即查深度問題"
            : "Ask deeper questions now";

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl">{question}</h1>

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">1. {c.a}</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-900 sm:text-base">{shortAnswer.map((line)=><li key={line}>- {line}</li>)}</ul>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">2. {c.b}</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-800 sm:text-base">{why}</p>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">3. {c.c}</h2>
        <ol className="mt-3 space-y-2 text-sm font-semibold text-zinc-900 sm:text-base">{steps.map((step, i)=><li key={step}>{i+1}. {step}</li>)}</ol>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">4. {c.d}</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-900 sm:text-base">{backup.map((line)=><li key={line}>- {line}</li>)}</ul>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">5. {c.e}</h2>
        <p className="mt-3 text-sm font-semibold text-zinc-900 sm:text-base"><Link href={item.mainFixHref.replace('/en/', `/${locale}/`)} className="underline">{mainFixLabel}</Link></p>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-900 bg-zinc-950 p-5 text-zinc-100">
        <h2 className="text-lg font-black tracking-tight">6. {quickAi}</h2>
        <div className="mt-3 space-y-2">
          {suggestedQueries.map((query) => (
            <a
              key={query}
              href={toPerplexitySearchUrl(query, locale, "problem")}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800"
            >
              {query}
            </a>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <Link href={`/${locale}/problems`} className="text-sm font-semibold text-zinc-700 underline">{c.all}</Link>
      </section>
    </Container>
  );
}
