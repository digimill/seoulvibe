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
    question: "Where should I exchange money in Korea for better rates?",
    shortAnswer: [
      "Skip airport-only exchange for all your budget.",
      "City exchange zones often give better rates than airport desks.",
      "Compare two counters first, then exchange in one shot.",
    ],
    why: "Travelers lose money by exchanging everything at the first visible counter and ignoring spread + fees.",
    steps: [
      "Exchange only day-one cash at airport.",
      "Compare rates in Myeongdong/Hongdae area counters.",
      "Avoid tiny repeated exchanges with extra conversion fees.",
    ],
    backup: [
      "Use card for chain stores and keep cash for small vendors.",
      "Use ATM withdrawal once if rate gap is small and urgent.",
    ],
    mainFixHref: "/en/tips/payment",
    mainFixLabel: "Money exchange quick guide",
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
    question: "How do I transfer lines and find exits without reading full subway maps?",
    shortAnswer: [
      "Focus on line number + exit number, not full map reading.",
      "Station signs are enough if you track transfer arrows step by step.",
      "Confirm exit number before leaving platform level.",
    ],
    why: "Visitors try to parse the whole network at once and miss simple in-station wayfinding cues.",
    steps: [
      "Check destination line number first.",
      "Follow transfer color signage and platform arrows only.",
      "At final station, verify exit number before tapping out.",
    ],
    backup: [
      "If confused, stay inside paid area and ask station staff.",
      "For short final leg, switch to taxi or bus outside station.",
    ],
    mainFixHref: "/en/tips/subway-map-confusion-cuts",
    mainFixLabel: "Subway transfer + exit guide",
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
    question: "How do I set up eSIM/SIM quickly when data is not working in Korea?",
    shortAnswer: [
      "Most failures are APN/profile activation issues, not dead service.",
      "Restarting after profile install fixes many first-hour failures.",
      "Keep one public Wi-Fi fallback spot in mind.",
    ],
    why: "Roaming profile install and APN setup differ by device/OS, so one missed step blocks data.",
    steps: [
      "Check eSIM profile is enabled and selected for data.",
      "Toggle airplane mode and restart once.",
      "Verify APN from provider instructions.",
    ],
    backup: [
      "Use station/convenience-store Wi-Fi to finish setup.",
      "Move to provider desk for QR re-issue if activation failed.",
    ],
    mainFixHref: "/en/tips/sim-wifi",
    mainFixLabel: "SIM/eSIM setup quick fix",
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
    question: "What should I do first in a medical emergency in Korea?",
    shortAnswer: [
      "For urgent danger, call 119 immediately.",
      "For mild issues, start with nearby pharmacy first.",
      "Use translation app + passport copy at registration.",
    ],
    why: "Travelers delay treatment because they are unsure whether to call emergency services or visit a clinic.",
    steps: [
      "Assess severity: emergency (119) vs clinic/pharmacy.",
      "Prepare symptoms in short translated sentences.",
      "Keep insurance/policy info and payment card ready.",
    ],
    backup: [
      "Use hotel/front desk support to call clinic.",
      "If language barrier is high, go to larger hospital ER.",
    ],
    mainFixHref: "/en/tips/pharmacy-hospital-emergency",
    mainFixLabel: "Medical emergency quick guide",
  },
  {
    slug: "what-should-i-buy-at-olive-young-under-50",
    question: "How do I navigate Seoul if I lose internet or translation apps?",
    shortAnswer: [
      "Use subway line number + exit number as your core anchor.",
      "Show destination in Korean screenshot when asking for help.",
      "Move to major station first, then reroute.",
    ],
    why: "When data drops, travelers keep walking in the wrong direction instead of resetting to a known transit hub.",
    steps: [
      "Save hotel name/address screenshot in Korean before going out.",
      "Memorize nearest station name and exit number.",
      "If lost, ask staff to point to that station first.",
    ],
    backup: [
      "Take taxi to known landmark/station instead of random drop-off.",
      "Use convenience store staff help for quick direction reset.",
    ],
    mainFixHref: "/en/tips/subway-map-confusion-cuts",
    mainFixLabel: "Offline navigation fallback guide",
  },
  {
    slug: "can-tourists-get-tax-refund-at-olive-young",
    question: "What should I do first if I lose my passport, wallet, or phone in Korea?",
    shortAnswer: [
      "Block cards first, then secure identity documents.",
      "Record last known location and time immediately.",
      "Report loss early to reduce misuse risk.",
    ],
    why: "Delayed reporting increases fraud exposure and makes retrieval much harder in crowded zones.",
    steps: [
      "Freeze/lock cards and connected payment apps.",
      "Contact embassy/consulate if passport is missing.",
      "File police/lost report and keep case number.",
    ],
    backup: [
      "Use cloud backup and remote lock for phone.",
      "Carry printed hotel info and emergency contacts in bag.",
    ],
    mainFixHref: "/en/tips/pharmacy-hospital-emergency",
    mainFixLabel: "Loss and emergency response guide",
  },
  {
    slug: "is-olive-young-cheaper-than-duty-free",
    question: "What is the tipping culture in Korea for tourists?",
    shortAnswer: [
      "Tipping is generally not expected in Korea.",
      "Service charge is usually built into listed prices.",
      "Simple thanks and polite tone matter more than cash tips.",
    ],
    why: "Visitors import tipping habits from other countries and feel uncertain during payment.",
    steps: [
      "Pay exact bill amount unless venue clearly asks for service fee/tip.",
      "At cafes and taxis, no extra tip is usually needed.",
      "Use verbal thanks instead of cash handoff.",
    ],
    backup: [
      "If unsure, ask staff directly before paying.",
      "Follow receipt amount as final in most everyday situations.",
    ],
    mainFixHref: "/en/tips/restaurant-culture",
    mainFixLabel: "Korea etiquette and culture guide",
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
    question: "How should I choose between AREX, airport bus, and taxi from the airport?",
    shortAnswer: [
      "AREX is usually fastest for light luggage.",
      "Airport bus is easier if you have heavy bags and fewer transfers.",
      "Taxi is best for late-night or door-to-door convenience.",
    ],
    why: "Most mistakes come from choosing by fare only and ignoring luggage, arrival time, and transfer complexity.",
    steps: [
      "Check luggage amount and final walking distance.",
      "Choose AREX for speed, bus for comfort, taxi for lowest friction.",
      "Re-check after immigration queue and actual arrival time.",
    ],
    backup: [
      "Split taxi if group size makes cost reasonable.",
      "Take airport bus first, then short taxi for final leg.",
    ],
    mainFixHref: "/en/tips/airport-to-city",
    mainFixLabel: "Airport transfer mode chooser",
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
    ko: "한국에서 환전은 어디가 유리한가요? (수수료/우대율)",
    ja: "Where should I exchange money in Korea for better rates?",
    "zh-cn": "Where should I exchange money in Korea for better rates?",
    "zh-tw": "Where should I exchange money in Korea for better rates?",
    "zh-hk": "Where should I exchange money in Korea for better rates?",
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
    ko: "지하철 노선도 없이 환승·출구를 찾으려면 어떻게 하나요?",
    ja: "How do I transfer lines and find exits without reading full subway maps?",
    "zh-cn": "How do I transfer lines and find exits without reading full subway maps?",
    "zh-tw": "How do I transfer lines and find exits without reading full subway maps?",
    "zh-hk": "How do I transfer lines and find exits without reading full subway maps?",
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
    ko: "한국에서 eSIM/SIM 데이터가 안 될 때 먼저 뭘 확인하나요?",
    ja: "How do I set up eSIM/SIM quickly when data is not working in Korea?",
    "zh-cn": "How do I set up eSIM/SIM quickly when data is not working in Korea?",
    "zh-tw": "How do I set up eSIM/SIM quickly when data is not working in Korea?",
    "zh-hk": "How do I set up eSIM/SIM quickly when data is not working in Korea?",
  },
  "what-to-do-if-seoul-is-too-crowded": {
    ko: "서울이 너무 붐빌 때 바로 뭘 해야 하나요?",
    ja: "ソウルが混みすぎてる時はどうする？",
    "zh-cn": "首尔太拥挤时该怎么办？",
    "zh-tw": "首爾太擠時該怎麼辦？",
    "zh-hk": "首爾太逼時應該點做？",
  },
  "best-olive-young-products-for-first-time-visitors": {
    ko: "한국에서 아프거나 다쳤을 때 병원/약국은 어떻게 이용하나요?",
    ja: "What should I do first in a medical emergency in Korea?",
    "zh-cn": "What should I do first in a medical emergency in Korea?",
    "zh-tw": "What should I do first in a medical emergency in Korea?",
    "zh-hk": "What should I do first in a medical emergency in Korea?",
  },
  "what-should-i-buy-at-olive-young-under-50": {
    ko: "오프라인 지도·번역 없이 길 찾으려면 어떻게 하나요?",
    ja: "How do I navigate Seoul if I lose internet or translation apps?",
    "zh-cn": "How do I navigate Seoul if I lose internet or translation apps?",
    "zh-tw": "How do I navigate Seoul if I lose internet or translation apps?",
    "zh-hk": "How do I navigate Seoul if I lose internet or translation apps?",
  },
  "can-tourists-get-tax-refund-at-olive-young": {
    ko: "여권·지갑·휴대폰 분실 시 가장 먼저 뭘 해야 하나요?",
    ja: "What should I do first if I lose my passport, wallet, or phone in Korea?",
    "zh-cn": "What should I do first if I lose my passport, wallet, or phone in Korea?",
    "zh-tw": "What should I do first if I lose my passport, wallet, or phone in Korea?",
    "zh-hk": "What should I do first if I lose my passport, wallet, or phone in Korea?",
  },
  "is-olive-young-cheaper-than-duty-free": {
    ko: "한국에서 팁 문화는 어떻게 되나요?",
    ja: "What is the tipping culture in Korea for tourists?",
    "zh-cn": "What is the tipping culture in Korea for tourists?",
    "zh-tw": "What is the tipping culture in Korea for tourists?",
    "zh-hk": "What is the tipping culture in Korea for tourists?",
  },
  "best-way-to-get-from-incheon-to-hongdae": {
    ko: "인천공항에서 홍대 가는 가장 좋은 방법은?",
    ja: "仁川空港からホンデへ行く最適ルートは？",
    "zh-cn": "仁川机场去弘大最好的方式是什么？",
    "zh-tw": "仁川機場去弘大最好的方式是什麼？",
    "zh-hk": "仁川機場去弘大最好點去？",
  },
  "is-taxi-from-airport-expensive-in-seoul": {
    ko: "공항철도·공항버스·택시 중 공항→시내는 뭘 고르면 좋나요?",
    ja: "How should I choose between AREX, airport bus, and taxi from the airport?",
    "zh-cn": "How should I choose between AREX, airport bus, and taxi from the airport?",
    "zh-tw": "How should I choose between AREX, airport bus, and taxi from the airport?",
    "zh-hk": "How should I choose between AREX, airport bus, and taxi from the airport?",
  },
};

export function getProblemQuestion(item: ProblemSeoItem, lang: Lang): string {
  if (lang === "en") return item.question;
  return localizedQuestions[item.slug]?.[lang] ?? item.question;
}
