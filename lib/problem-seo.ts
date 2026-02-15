import type { Lang } from "@/lib/i18n";

export type ProblemSeoItem = {
  slug: string;
  question: string;
  shortAnswer: [string, string, string];
  why: string;
  steps: string[];
  backup: string[];
  mainFixHref: string;
  mainFixLabel: string;
};

export const problemSeoItems: ProblemSeoItem[] = [
  {
    slug: "why-does-my-card-fail-at-kiosks-in-korea",
    question: "Why does my card fail at kiosks in Korea?",
    shortAnswer: [
      "Kiosk readers are less stable than counter terminals.",
      "Chip insert fails more often than tap for foreign cards.",
      "Use counter payment fast instead of retry loops.",
    ],
    why: "Most kiosks are optimized for local repeat users. Language UI is compressed, payment retries are unclear, and foreign chip handling is inconsistent.",
    steps: [
      "Try tap before insert.",
      "If it fails once, switch to another card immediately.",
      "Ask staff: Can I pay at the counter?",
      "Skip membership prompts and use guest checkout.",
    ],
    backup: [
      "Move to another branch in the same area.",
      "Use convenience-store ATM cash as temporary backup.",
    ],
    mainFixHref: "/en/kiosk-card-rejected",
    mainFixLabel: "Kiosk card rejected main fix",
  },
  {
    slug: "can-foreigners-use-visa-at-korean-kiosks",
    question: "Can foreigners use Visa at Korean kiosks?",
    shortAnswer: [
      "Yes, often.",
      "But kiosk compatibility is lower than staffed counters.",
      "If Visa fails once, switch terminal or counter.",
    ],
    why: "Card network support is broad, but kiosk hardware and software vary by chain and branch.",
    steps: [
      "Use contactless first.",
      "Do one retry max on same terminal.",
      "Ask for counter terminal payment.",
      "Keep a second card ready.",
    ],
    backup: [
      "Pay with another major card brand.",
      "Use nearby branch with lower queue pressure.",
    ],
    mainFixHref: "/en/kiosk-card-rejected",
    mainFixLabel: "Kiosk card rejected main fix",
  },
  {
    slug: "why-is-kiosk-asking-for-phone-number-in-korea",
    question: "Why is kiosk asking for phone number in Korea?",
    shortAnswer: [
      "Usually it is membership signup, not required payment.",
      "Foreign visitors can often skip it.",
      "Choose guest checkout when available.",
    ],
    why: "Many kiosks bundle payment with loyalty systems that assume local phone numbers.",
    steps: [
      "Look for Skip, Guest, or non-member options.",
      "Ignore points prompts unless you have local number.",
      "If stuck, ask to pay at counter.",
    ],
    backup: [
      "Order at staffed POS.",
      "Use a different chain with simpler checkout UI.",
    ],
    mainFixHref: "/en/kiosk-card-rejected",
    mainFixLabel: "Kiosk card rejected main fix",
  },
  {
    slug: "how-to-pay-if-my-card-doesnt-work-in-seoul",
    question: "How to pay if my card doesn’t work in Seoul?",
    shortAnswer: [
      "Do not keep retrying one machine.",
      "Switch card or switch terminal fast.",
      "Use counter payment as primary fallback.",
    ],
    why: "Most failures are terminal-specific, not bank-wide card blocks.",
    steps: [
      "Retry once with tap.",
      "Use second card.",
      "Ask for counter terminal.",
      "If still blocked, carry small cash buffer same day.",
    ],
    backup: [
      "Use convenience-store ATM and continue day.",
      "Move to major chain branch with higher foreign-card success.",
    ],
    mainFixHref: "/en/kiosk-card-rejected",
    mainFixLabel: "Kiosk payment recovery guide",
  },
  {
    slug: "do-korean-cafes-accept-foreign-credit-cards",
    question: "Do Korean cafes accept foreign credit cards?",
    shortAnswer: [
      "Most do.",
      "Failures happen more at self-order kiosks than counters.",
      "If card fails, order directly with staff.",
    ],
    why: "Cafe payment systems are mixed: some branches prioritize kiosk speed over robust foreign-card handling.",
    steps: [
      "Try tap payment once.",
      "If rejected, go straight to counter.",
      "Skip phone-number membership flow.",
    ],
    backup: [
      "Use another nearby cafe chain.",
      "Use cash for one meal and keep moving.",
    ],
    mainFixHref: "/en/kiosk-card-rejected",
    mainFixLabel: "Cafe kiosk card fix",
  },
  {
    slug: "how-much-tmoney-should-a-tourist-load",
    question: "How much T-money should a tourist load?",
    shortAnswer: [
      "For 3-4 days, start around KRW 25,000-35,000.",
      "Keep KRW 7,000-10,000 as minimum floor.",
      "Refill before peak commute, not during.",
    ],
    why: "Visitors under-load, then lose time topping up under rush pressure.",
    steps: [
      "Load by trip length, not by single ride estimates.",
      "Set a minimum balance alert habit.",
      "Top up at day start or day end.",
    ],
    backup: [
      "If queue is long, top up at next less crowded station.",
      "Keep one short taxi backup budget for urgent timing.",
    ],
    mainFixHref: "/en/how-much-tmoney",
    mainFixLabel: "T-money main fix",
  },
  {
    slug: "which-subway-line-goes-to-hongdae-from-airport",
    question: "Which subway line goes to Hongdae from airport?",
    shortAnswer: [
      "Use AREX toward Seoul side.",
      "Get off at Hongik Univ. Station.",
      "Double-check final station before boarding.",
    ],
    why: "Airport routes have multiple service patterns and visitors rush transfers with luggage.",
    steps: [
      "Follow AREX signs first.",
      "Confirm destination includes Hongik Univ.",
      "At platform, check last station name on screen.",
    ],
    backup: [
      "Take airport bus to Hongdae-area stop.",
      "Use taxi if arrival is very late with heavy bags.",
    ],
    mainFixHref: "/en/tips/subway-map-confusion-cuts",
    mainFixLabel: "Subway direction fix page",
  },
  {
    slug: "how-to-avoid-taking-wrong-subway-direction-in-seoul",
    question: "How to avoid taking wrong subway direction in Seoul?",
    shortAnswer: [
      "Ignore color first.",
      "Check last station name for direction.",
      "Confirm twice before gate entry.",
    ],
    why: "Line color looks simple, but direction logic depends on terminal station and branch routes.",
    steps: [
      "Set destination in map app.",
      "At platform sign, match final station name.",
      "If unsure, ask station staff before boarding.",
    ],
    backup: [
      "If wrong train, get off next station and reverse.",
      "Use bus for short cross-neighborhood moves.",
    ],
    mainFixHref: "/en/tips/subway-map-confusion-cuts",
    mainFixLabel: "Subway confusion main fix",
  },
  {
    slug: "what-happens-if-i-miss-my-subway-stop-in-korea",
    question: "What happens if I miss my subway stop in Korea?",
    shortAnswer: [
      "Nothing dramatic.",
      "Get off next station and take opposite train.",
      "You usually keep transfer fare logic if timing is normal.",
    ],
    why: "Visitors panic and over-correct instead of using the simple reverse pattern.",
    steps: [
      "Exit at next stop.",
      "Cross to opposite direction platform.",
      "Re-enter route to original destination.",
    ],
    backup: [
      "If too late, switch to taxi for final leg.",
      "Use nearby cafe break and restart route calmly.",
    ],
    mainFixHref: "/en/tips/subway-map-confusion-cuts",
    mainFixLabel: "Missed-stop subway fix",
  },
  {
    slug: "is-line-2-confusing-for-tourists",
    question: "Is Line 2 confusing for tourists?",
    shortAnswer: [
      "Yes, especially first week.",
      "It loops and direction errors are common.",
      "Use terminal station check every ride.",
    ],
    why: "Circle behavior plus crowd pressure at peak times causes quick misreads.",
    steps: [
      "Avoid Line 2 at 6-8pm if possible.",
      "Check final station name before platform entry.",
      "Ask staff when uncertain.",
    ],
    backup: [
      "Use Line 3/AREX alternatives where route allows.",
      "Take short taxi hops to bypass worst transfer knots.",
    ],
    mainFixHref: "/en/tips/subway-map-confusion-cuts",
    mainFixLabel: "Line 2 confusion fix",
  },
  {
    slug: "how-to-avoid-crowds-in-hongdae",
    question: "How to avoid crowds in Hongdae?",
    shortAnswer: [
      "Do not start on main strip at peak.",
      "Use Yeonnam side first.",
      "Shift dinner earlier or later.",
    ],
    why: "Everyone funnels into identical blocks around prime time windows.",
    steps: [
      "Arrive before 6pm or after 10pm.",
      "Walk two streets off the busiest axis.",
      "Pick side-alley bars over viral fronts.",
    ],
    backup: [
      "Move to Hapjeong/Sangsu for one stop.",
      "Return when peak wave drops.",
    ],
    mainFixHref: "/en/crowded",
    mainFixLabel: "Crowd escape main fix",
  },
  {
    slug: "best-time-to-visit-bukchon-without-crowds",
    question: "Best time to visit Bukchon without crowds?",
    shortAnswer: [
      "Early morning is best.",
      "Aim before 10:00.",
      "After lunch gets crowded fast.",
    ],
    why: "Tour buses and walking groups cluster heavily from late morning.",
    steps: [
      "Go at opening movement time.",
      "Finish core photo lanes early.",
      "Shift to Samcheong-gil when crowd rises.",
    ],
    backup: [
      "Swap to museum/tea house nearby.",
      "Return on weekday morning.",
    ],
    mainFixHref: "/en/areas/bukchon",
    mainFixLabel: "Bukchon area quick-fix page",
  },
  {
    slug: "is-gangnam-crowded-at-night",
    question: "Is Gangnam crowded at night?",
    shortAnswer: [
      "Yes, often.",
      "Transit nodes and main strips get dense.",
      "Have a side-street backup route.",
    ],
    why: "Workday exits, dinner windows, and shopping traffic overlap.",
    steps: [
      "Avoid main transfer exits at peak.",
      "Set destination one block away, then walk.",
      "Delay move by 20-30 minutes when possible.",
    ],
    backup: [
      "Use bus or taxi short-hop across choke points.",
      "Pivot to nearby calmer neighborhood for meal.",
    ],
    mainFixHref: "/en/crowded",
    mainFixLabel: "Night crowd recovery page",
  },
  {
    slug: "what-to-do-if-seoul-is-too-crowded",
    question: "What to do if Seoul is too crowded?",
    shortAnswer: [
      "Do not force the same block.",
      "Exit two streets out and reset.",
      "Use area-level backup immediately.",
    ],
    why: "Viral zones synchronize crowd flow at the same times every day.",
    steps: [
      "Leave the choke point first.",
      "Pick nearest alternate street or station.",
      "Resume your plan with one priority stop only.",
    ],
    backup: [
      "Move schedule to weekday daytime.",
      "Skip one attraction and protect meal/return timing.",
    ],
    mainFixHref: "/en/crowded",
    mainFixLabel: "Crowd emergency page",
  },
  {
    slug: "best-olive-young-products-for-first-time-visitors",
    question: "Best Olive Young products for first-time visitors",
    shortAnswer: [
      "Start with basics, not trend stacks.",
      "Cleanser, toner, sheet masks, lip tint is enough.",
      "Limit optional add-ons to one item.",
    ],
    why: "Shelf volume is high and trend pressure pushes overbuying.",
    steps: [
      "Run a 30-minute timer.",
      "Build core set first.",
      "Only buy products with readable labels.",
    ],
    backup: [
      "If branch is packed, switch branch quickly.",
      "Buy core items now and skip experimental products.",
    ],
    mainFixHref: "/en/olive-young-tourist-guide",
    mainFixLabel: "Olive Young main fix",
  },
  {
    slug: "what-should-i-buy-at-olive-young-under-50",
    question: "What should I buy at Olive Young under $50?",
    shortAnswer: [
      "Use a strict starter pack.",
      "Cleanser + toner + sheet mask bundle + lip tint.",
      "Skip 10-step sets on first visit.",
    ],
    why: "Budget leaks happen when visitors chase every trending shelf.",
    steps: [
      "Set budget cap before basket.",
      "Pick one item per core category.",
      "Stop after core pack is complete.",
    ],
    backup: [
      "Drop optional color items first.",
      "Return later only if skin tolerates initial buys.",
    ],
    mainFixHref: "/en/olive-young-tourist-guide",
    mainFixLabel: "Under-$50 Olive Young guide",
  },
  {
    slug: "can-tourists-get-tax-refund-at-olive-young",
    question: "Can tourists get tax refund at Olive Young?",
    shortAnswer: [
      "Often yes.",
      "Process depends on branch and purchase conditions.",
      "Bring passport at checkout.",
    ],
    why: "Rules vary by store process and threshold, so assumptions fail.",
    steps: [
      "Ask cashier before payment.",
      "Show passport and confirm tax-refund handling.",
      "Keep receipt organized for departure day.",
    ],
    backup: [
      "If this branch cannot process cleanly, switch branch.",
      "Prioritize product fit over small refund amount.",
    ],
    mainFixHref: "/en/olive-young-tourist-guide",
    mainFixLabel: "Tax refund + Olive Young fix",
  },
  {
    slug: "is-olive-young-cheaper-than-duty-free",
    question: "Is Olive Young cheaper than duty free?",
    shortAnswer: [
      "Sometimes, not always.",
      "It depends on brand, promo cycle, and duty-free category.",
      "For short trips, convenience often beats price hunting.",
    ],
    why: "Price comparisons shift by event timing and product type, not one universal rule.",
    steps: [
      "Compare only your top 2-3 items.",
      "Check in-store promotions first.",
      "Buy where stock and checkout are faster.",
    ],
    backup: [
      "If uncertain, buy travel-size basics now.",
      "Do final price optimization at airport only for remaining items.",
    ],
    mainFixHref: "/en/olive-young-tourist-guide",
    mainFixLabel: "Olive Young buying strategy",
  },
  {
    slug: "best-way-to-get-from-incheon-to-hongdae",
    question: "Best way to get from Incheon to Hongdae?",
    shortAnswer: [
      "AREX + Hongik Univ. stop is the usual default.",
      "Airport bus can be easier with heavy luggage.",
      "Late-night arrival may justify taxi.",
    ],
    why: "Arrival fatigue makes transfer complexity feel bigger than it is.",
    steps: [
      "Choose by luggage + arrival time.",
      "If train, confirm Hongik Univ. stop before boarding.",
      "Keep backup bus/taxi option ready.",
    ],
    backup: [
      "If rail confusion starts, switch to airport bus.",
      "If midnight timing is tight, use taxi and recover sleep.",
    ],
    mainFixHref: "/en/tips/subway-map-confusion-cuts",
    mainFixLabel: "Airport-to-city movement fix",
  },
  {
    slug: "is-taxi-from-airport-expensive-in-seoul",
    question: "Is taxi from airport expensive in Seoul?",
    shortAnswer: [
      "Usually more expensive than rail or bus.",
      "But time and luggage can make it worth it.",
      "Use it as stress-reduction tool, not default.",
    ],
    why: "Travelers compare only fare, ignoring fatigue, late arrival, and transfer risk.",
    steps: [
      "Check arrival time and baggage load.",
      "Compare taxi to AREX/bus for your exact endpoint.",
      "Choose the option that protects next-day schedule.",
    ],
    backup: [
      "Split taxi with group to cut cost.",
      "Take bus first, then short taxi from terminal area.",
    ],
    mainFixHref: "/en/tips/subway-map-confusion-cuts",
    mainFixLabel: "Airport transfer decision guide",
  },
];

export function getProblemSeoBySlug(slug: string): ProblemSeoItem | undefined {
  return problemSeoItems.find((item) => item.slug === slug);
}

const localizedQuestions: Record<string, Record<Exclude<Lang, "en">, string>> = {
  "why-does-my-card-fail-at-kiosks-in-korea": {
    ko: "한국 키오스크에서 카드가 왜 자꾸 실패하나요?",
    ja: "韓国のキオスクでカードが失敗するのはなぜ？",
    "zh-cn": "为什么我在韩国自助机刷卡总失败？",
    "zh-tw": "為什麼我在韓國自助機刷卡一直失敗？",
    "zh-hk": "點解我喺韓國自助機碌卡成日失敗？",
  },
  "can-foreigners-use-visa-at-korean-kiosks": {
    ko: "외국인은 한국 키오스크에서 비자카드 쓸 수 있나요?",
    ja: "外国人は韓国キオスクでVisaを使える？",
    "zh-cn": "外国游客能在韩国自助机用 Visa 吗？",
    "zh-tw": "外國旅客可以在韓國自助機用 Visa 嗎？",
    "zh-hk": "外國人可唔可以喺韓國自助機用 Visa？",
  },
  "why-is-kiosk-asking-for-phone-number-in-korea": {
    ko: "한국 키오스크에서 왜 전화번호를 입력하라고 하나요?",
    ja: "韓国キオスクで電話番号を求められる理由は？",
    "zh-cn": "韩国自助机为什么要我输入手机号？",
    "zh-tw": "韓國自助機為什麼要我輸入手機號？",
    "zh-hk": "韓國自助機點解要我入電話號碼？",
  },
  "how-to-pay-if-my-card-doesnt-work-in-seoul": {
    ko: "서울에서 카드가 안 될 때 결제는 어떻게 해야 하나요?",
    ja: "ソウルでカードが通らない時はどう払う？",
    "zh-cn": "在首尔刷卡失败时该怎么付款？",
    "zh-tw": "在首爾刷卡失敗時要怎麼付款？",
    "zh-hk": "喺首爾張卡唔過數，點樣俾錢？",
  },
  "do-korean-cafes-accept-foreign-credit-cards": {
    ko: "한국 카페에서 외국 신용카드 결제되나요?",
    ja: "韓国のカフェで海外クレカは使える？",
    "zh-cn": "韩国咖啡店能刷外国信用卡吗？",
    "zh-tw": "韓國咖啡店可以刷外國信用卡嗎？",
    "zh-hk": "韓國咖啡店收唔收外國信用卡？",
  },
  "how-much-tmoney-should-a-tourist-load": {
    ko: "여행자는 티머니를 얼마 충전해야 하나요?",
    ja: "旅行者はT-moneyをいくらチャージすべき？",
    "zh-cn": "游客 T-money 该充多少？",
    "zh-tw": "旅客 T-money 要儲多少？",
    "zh-hk": "遊客 T-money 應該儲幾多？",
  },
  "which-subway-line-goes-to-hongdae-from-airport": {
    ko: "공항에서 홍대로 갈 때 무슨 지하철 노선을 타야 하나요?",
    ja: "空港からホンデへはどの路線？",
    "zh-cn": "从机场去弘大该坐哪条线？",
    "zh-tw": "從機場去弘大要搭哪條線？",
    "zh-hk": "由機場去弘大要搭邊條線？",
  },
  "how-to-avoid-taking-wrong-subway-direction-in-seoul": {
    ko: "서울 지하철 반대 방향 실수를 피하려면?",
    ja: "ソウル地下鉄で逆方向を避けるには？",
    "zh-cn": "在首尔怎么避免坐反方向地铁？",
    "zh-tw": "在首爾怎麼避免搭錯方向？",
    "zh-hk": "喺首爾點樣避免搭錯方向？",
  },
  "what-happens-if-i-miss-my-subway-stop-in-korea": {
    ko: "한국 지하철에서 내릴 역을 놓치면 어떻게 되나요?",
    ja: "韓国で降車駅を過ぎたらどうなる？",
    "zh-cn": "在韩国地铁坐过站会怎样？",
    "zh-tw": "在韓國地鐵坐過站會怎樣？",
    "zh-hk": "喺韓國地鐵坐過站會點？",
  },
  "is-line-2-confusing-for-tourists": {
    ko: "서울 2호선은 여행자에게 헷갈리나요?",
    ja: "2号線は旅行者にとって分かりにくい？",
    "zh-cn": "2号线对游客来说很容易混乱吗？",
    "zh-tw": "2號線對旅客來說很容易搞混嗎？",
    "zh-hk": "2號線對遊客係咪好易搞亂？",
  },
  "how-to-avoid-crowds-in-hongdae": {
    ko: "홍대 인파를 피하려면 어떻게 해야 하나요?",
    ja: "ホンデの混雑を避けるには？",
    "zh-cn": "怎么避开弘大人潮？",
    "zh-tw": "怎麼避開弘大人潮？",
    "zh-hk": "點樣避開弘大人潮？",
  },
  "best-time-to-visit-bukchon-without-crowds": {
    ko: "북촌을 덜 붐빌 때 가려면 언제가 좋나요?",
    ja: "プクチョンを空いてる時間に行くならいつ？",
    "zh-cn": "北村什么时候去人最少？",
    "zh-tw": "北村什麼時候去比較不擠？",
    "zh-hk": "北村幾點去會冇咁逼？",
  },
  "is-gangnam-crowded-at-night": {
    ko: "강남은 밤에 많이 붐비나요?",
    ja: "カンナムは夜に混む？",
    "zh-cn": "江南晚上很拥挤吗？",
    "zh-tw": "江南晚上很擠嗎？",
    "zh-hk": "江南夜晚係咪好逼？",
  },
  "what-to-do-if-seoul-is-too-crowded": {
    ko: "서울이 너무 붐빌 때 바로 뭘 해야 하나요?",
    ja: "ソウルが混みすぎてる時はどうする？",
    "zh-cn": "首尔太拥挤时该怎么办？",
    "zh-tw": "首爾太擠時該怎麼辦？",
    "zh-hk": "首爾太逼時應該點做？",
  },
  "best-olive-young-products-for-first-time-visitors": {
    ko: "처음 가는 여행자가 올리브영에서 뭘 사면 좋나요?",
    ja: "初めての旅行者向けオリーブヤングおすすめは？",
    "zh-cn": "第一次去 Olive Young 最该买什么？",
    "zh-tw": "第一次去 Olive Young 最推薦買什麼？",
    "zh-hk": "第一次去 Olive Young 最應該買咩？",
  },
  "what-should-i-buy-at-olive-young-under-50": {
    ko: "올리브영에서 50달러 이하로 뭐 사면 좋나요?",
    ja: "オリーブヤングで50ドル以内なら何を買う？",
    "zh-cn": "Olive Young 50 美元以内买什么最稳？",
    "zh-tw": "Olive Young 50 美元內買什麼最穩？",
    "zh-hk": "Olive Young 50 美元內買咩最穩陣？",
  },
  "can-tourists-get-tax-refund-at-olive-young": {
    ko: "올리브영에서 여행자도 택스리펀드 받을 수 있나요?",
    ja: "オリーブヤングで旅行者は免税還付できる？",
    "zh-cn": "游客在 Olive Young 可以退税吗？",
    "zh-tw": "旅客在 Olive Young 可以退稅嗎？",
    "zh-hk": "遊客喺 Olive Young 可唔可以退稅？",
  },
  "is-olive-young-cheaper-than-duty-free": {
    ko: "올리브영이 면세점보다 더 저렴한가요?",
    ja: "オリーブヤングは免税店より安い？",
    "zh-cn": "Olive Young 会比免税店便宜吗？",
    "zh-tw": "Olive Young 會比免稅店便宜嗎？",
    "zh-hk": "Olive Young 會唔會平過免稅店？",
  },
  "best-way-to-get-from-incheon-to-hongdae": {
    ko: "인천공항에서 홍대 가는 가장 좋은 방법은?",
    ja: "仁川空港からホンデへ行く最適ルートは？",
    "zh-cn": "仁川机场去弘大最好的方式是什么？",
    "zh-tw": "仁川機場去弘大最好的方式是什麼？",
    "zh-hk": "仁川機場去弘大最好點去？",
  },
  "is-taxi-from-airport-expensive-in-seoul": {
    ko: "서울 공항 택시는 많이 비싼가요?",
    ja: "ソウルで空港タクシーは高い？",
    "zh-cn": "首尔机场打车会很贵吗？",
    "zh-tw": "首爾機場搭計程車會很貴嗎？",
    "zh-hk": "首爾機場搭的士係咪好貴？",
  },
};

export function getProblemQuestion(item: ProblemSeoItem, lang: Lang): string {
  if (lang === "en") return item.question;
  return localizedQuestions[item.slug]?.[lang] ?? item.question;
}
