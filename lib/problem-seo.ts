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
