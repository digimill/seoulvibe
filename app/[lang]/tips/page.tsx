import { notFound } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionBlock } from "@/components/SectionBlock";
import { TagBadge } from "@/components/TagBadge";
import { getTips } from "@/lib/content";
import { isLang, type Lang } from "@/lib/i18n";

type TipsPageProps = {
  params: Promise<{ lang: string }>;
  searchParams?: Promise<{ q?: string; cat?: string }>;
};

const PRIORITY_IDS = ["kiosk-survival-flow", "subway-map-confusion-cuts", "oliveyoung-master-playbook"];
const QUICK_NAV = [
  { key: "payment", id: "payment", group: "urgent" },
  { key: "sim", id: "sim-wifi", group: "urgent" },
  { key: "airport", id: "airport-to-city", group: "urgent" },
  { key: "medical", id: "pharmacy-hospital-emergency", group: "urgent" },
  { key: "subway", id: "subway-map-confusion-cuts", group: "confusing" },
  { key: "kiosk", id: "kiosk-survival-flow", group: "confusing" },
  { key: "order", id: "cafe-ordering", group: "confusing" },
  { key: "crowd", id: "popup-radar-weekly", group: "confusing" },
] as const;

const TIP_CATEGORY_BY_ID: Record<string, "payment" | "transport" | "data" | "airport" | "medical" | "shopping" | "other"> = {
  payment: "payment",
  transport: "transport",
  "subway-map-confusion-cuts": "transport",
  "kiosk-survival-flow": "payment",
  "sim-wifi": "data",
  "airport-to-city": "airport",
  "pharmacy-hospital-emergency": "medical",
  "one-manwon-seoul-loop": "shopping",
};

function quickLabels(lang: Lang): Record<(typeof QUICK_NAV)[number]["key"], string> {
  if (lang === "ko") {
    return {
      payment: "결제가 안 될 때",
      kiosk: "키오스크가 막힐 때",
      subway: "지하철이 헷갈릴 때",
      airport: "공항에서 길을 못 찾을 때",
      sim: "인터넷이 안 될 때",
      crowd: "사람이 너무 많을 때",
      medical: "아프거나 다쳤을 때",
      order: "주문이 어렵게 느껴질 때",
    };
  }
  return {
    payment: "Payment not working",
    kiosk: "Stuck at a kiosk",
    subway: "Subway direction confusion",
    airport: "Airport to city transfer",
    sim: "eSIM/data not working",
    crowd: "Too crowded right now",
    medical: "Sick or injured",
    order: "Ordering trouble at cafe/restaurant",
  };
}

function quickSectionCopy(lang: Lang) {
  if (lang === "ko") {
    return {
      urgentTitle: "지금 정말 급한가요?",
      urgentBadge: "긴급",
      confusingTitle: "헷갈리는 상황인가요?",
    };
  }
  return {
    urgentTitle: "Need help right now?",
    urgentBadge: "Urgent",
    confusingTitle: "Feeling confused?",
  };
}

export default async function TipsPage({ params, searchParams }: TipsPageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const sp = (await searchParams) ?? {};
  const query = (sp.q ?? "").trim().toLowerCase();
  const rawCategory = (sp.cat ?? "all").trim();
  const selectedCategory = ["all", "payment", "transport", "data", "airport", "medical", "shopping"].includes(rawCategory) ? rawCategory : "all";
  const tips = await getTips(locale);
  const copy =
    locale === "ko"
      ? {
          title: "문제 인덱스",
          desc: "모든 문제 해결 방법을 검색하고 빠르게 찾으세요.",
          qTitle: "지금 당장 막힌 상황은?",
          cta: "지금 해결하기",
          indexTag: "INDEX",
          allCount: "전체",
          shownCount: "현재",
          searchPlaceholder: "키워드 검색 (예: 카드, 공항, eSIM)",
          searchBtn: "검색",
          clearBtn: "초기화",
        }
      : locale === "ja"
        ? {
            title: "トラブル解決ガイド",
            desc: "全体を検索し、カテゴリで素早く絞り込み。",
            qTitle: "今すぐ困っている状況は？",
            cta: "今すぐ解決",
            indexTag: "INDEX",
            allCount: "全体",
            shownCount: "表示",
            searchPlaceholder: "キーワード検索",
            searchBtn: "検索",
            clearBtn: "リセット",
          }
        : locale === "zh-cn"
          ? {
              title: "问题速解指南",
              desc: "先搜索，再按分类快速缩小范围。",
              qTitle: "你现在卡在哪一步？",
              cta: "立即处理",
              indexTag: "INDEX",
              allCount: "总数",
              shownCount: "当前",
              searchPlaceholder: "关键词搜索",
              searchBtn: "搜索",
              clearBtn: "重置",
            }
          : locale === "zh-tw" || locale === "zh-hk"
            ? {
                title: "問題速解指南",
                desc: "先搜尋，再用分類快速縮小範圍。",
                qTitle: "你現在卡在哪一步？",
                cta: "立即處理",
                indexTag: "INDEX",
                allCount: "總數",
                shownCount: "目前",
                searchPlaceholder: "關鍵字搜尋",
                searchBtn: "搜尋",
                clearBtn: "重設",
              }
            : {
                title: "Problem Guide Index",
                desc: "Search all issues and narrow quickly with categories.",
                qTitle: "What are you stuck on right now?",
                cta: "Fix this now",
                indexTag: "INDEX",
                allCount: "All",
                shownCount: "Showing",
                searchPlaceholder: "Search keyword",
                searchBtn: "Search",
                clearBtn: "Reset",
              };
  const sorted = [...tips].sort((a, b) => {
    const ai = PRIORITY_IDS.indexOf(a.id);
    const bi = PRIORITY_IDS.indexOf(b.id);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
  const categoryLabels =
    locale === "ko"
      ? {
          all: "전체",
          payment: "결제",
          transport: "교통",
          data: "데이터",
          airport: "공항",
          medical: "의료",
          shopping: "쇼핑",
        }
      : {
          all: "All",
          payment: "Payment",
          transport: "Transport",
          data: "Data",
          airport: "Airport",
          medical: "Medical",
          shopping: "Shopping",
        };
  const filteredTips = sorted.filter((tip) => {
    const cat = TIP_CATEGORY_BY_ID[tip.id] ?? "other";
    if (selectedCategory !== "all" && selectedCategory !== cat) return false;
    if (!query) return true;
    const haystack = `${tip.title} ${tip.summary} ${tip.tags.join(" ")}`.toLowerCase();
    return haystack.includes(query);
  });
  const quickLabelMap = quickLabels(locale);
  const sectionCopy = quickSectionCopy(locale);
  const quickItems: Array<{ id: string; label: string; group: "urgent" | "confusing" }> = [];
  for (const item of QUICK_NAV) {
    const tip = tips.find((t) => t.id === item.id);
    if (!tip) continue;
    quickItems.push({ id: item.id, label: quickLabelMap[item.key], group: item.group });
  }
  const urgentItems = quickItems.filter((item) => item.group === "urgent");
  const confusingItems = quickItems.filter((item) => item.group === "confusing");

  return (
    <SectionBlock title={copy.title} description={copy.desc}>
      <section className="mb-6 rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
          <span className="rounded-full border border-zinc-300 px-2 py-1">{copy.indexTag}</span>
          <span>{copy.allCount} {tips.length}</span>
          <span>{copy.shownCount} {filteredTips.length}</span>
        </div>
        <form action={`/${locale}/tips`} method="get" className="mt-3 flex flex-wrap gap-2">
          <input
            type="text"
            name="q"
            defaultValue={sp.q ?? ""}
            placeholder={copy.searchPlaceholder}
            className="min-w-[14rem] flex-1 rounded-xl border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-900"
          />
          <input type="hidden" name="cat" value={selectedCategory} />
          <button type="submit" className="rounded-xl border border-zinc-900 bg-zinc-900 px-4 py-2 text-sm font-bold text-white">
            {copy.searchBtn}
          </button>
          <Link href={`/${locale}/tips`} className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700">
            {copy.clearBtn}
          </Link>
        </form>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {Object.entries(categoryLabels).map(([key, label]) => {
            const params = new URLSearchParams();
            if (sp.q) params.set("q", sp.q);
            if (key !== "all") params.set("cat", key);
            const href = params.toString() ? `/${locale}/tips?${params.toString()}` : `/${locale}/tips`;
            const active = key === selectedCategory || (key === "all" && selectedCategory === "all");
            return (
              <Link
                key={key}
                href={href}
                className={`rounded-full px-3 py-1 font-semibold ${active ? "border border-zinc-900 bg-zinc-900 text-white" : "border border-zinc-300 text-zinc-700"}`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTips.map((tip) => (
          <Card
            key={tip.id}
            href={`/${locale}/tips/${tip.id}`}
            title={tip.title}
            description={tip.summary}
            image={tip.image}
            imageRatio="3 / 2"
            ctaLabel={copy.cta}
            footer={tip.tags.map((tag) => (
              <TagBadge key={tag}>{tag}</TagBadge>
            ))}
          />
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-zinc-200 bg-white p-5 sm:p-7" id="problem-list">
        <h3 className="text-xl font-black tracking-tight text-zinc-950">{copy.qTitle}</h3>
        <div className="mt-5">
          <p className="text-sm font-black tracking-tight text-zinc-900">{sectionCopy.urgentTitle}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {urgentItems.map((item) => (
              <Link
                key={item.id}
                href={`/${locale}/tips/${item.id}`}
                className="rounded-2xl border border-rose-300 bg-rose-50/60 p-3 text-sm font-semibold text-zinc-900 hover:bg-rose-100/70"
              >
                <span className="mr-2 inline-flex rounded-full border border-rose-300 bg-white px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-rose-700">{sectionCopy.urgentBadge}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <p className="text-sm font-black tracking-tight text-zinc-900">{sectionCopy.confusingTitle}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {confusingItems.map((item) => (
              <Link
                key={item.id}
                href={`/${locale}/tips/${item.id}`}
                className="rounded-2xl border border-zinc-300 p-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </SectionBlock>
  );
}
