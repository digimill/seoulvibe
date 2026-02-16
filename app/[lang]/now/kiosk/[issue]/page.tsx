import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { isLang, type Lang } from "@/lib/i18n";

type IssueId = "card-rejected" | "no-english" | "phone-number" | "frozen-timeout";
const ISSUE_IDS: IssueId[] = ["card-rejected", "no-english", "phone-number", "frozen-timeout"];

type PageProps = { params: Promise<{ lang: string; issue: string }> };

function isIssueId(value: string): value is IssueId {
  return ISSUE_IDS.includes(value as IssueId);
}

function copy(lang: Lang, issue: IssueId) {
  if (lang === "ko") {
    const common = {
      back: "키오스크로",
      whatNow: "지금 바로 할 일",
      why: "왜 생기나",
      blocked: "막히면 이렇게",
      show: "직원에게 보여주기",
      phraseLabel: "현장 문구",
      sim: "키오스크 시뮬레이션",
    };
    if (issue === "card-rejected") {
      return {
        ...common,
        title: "카드 거절",
        lead: "당황하지 말고 이 순서대로 하세요.",
        steps: ["탭 결제를 먼저 시도", "다른 카드로 1회 시도", "카운터 결제 요청"],
        whyItems: ["해외 카드 PIN 미지원 단말", "오프라인 단말 상태", "멤버십 화면 개입"],
        blockedItems: ["바로 카운터 결제를 요청하세요."],
        phrase: "카운터 결제 가능할까요?",
      };
    }
    if (issue === "no-english") {
      return {
        ...common,
        title: "영어 옵션 없음",
        lead: "짧게 확인하고 바로 이동하세요.",
        steps: ["우상단 LANG 버튼 찾기", "버튼이 없으면 카운터로 이동"],
        whyItems: ["브랜드별 언어 버튼 위치 차이", "가맹점 UI 버전 차이"],
        blockedItems: ["직원에게 언어 전환 또는 카운터 결제를 요청하세요."],
        phrase: "영어 메뉴 있나요?",
      };
    }
    if (issue === "phone-number") {
      return {
        ...common,
        title: "전화번호 입력 화면",
        lead: "결제 필수 단계가 아니라 멤버십 단계일 가능성이 큽니다.",
        steps: ["멤버십 가입 건너뛰기", "비회원 결제 선택", "가능하면 전화번호 칸 비워두기"],
        whyItems: ["멤버십 가입 유도 화면", "포인트 적립용 필수 항목"],
        blockedItems: ["진행이 막히면 카운터 결제로 전환하세요."],
        phrase: "비회원 결제 가능할까요?",
      };
    }
    return {
      ...common,
      title: "화면 멈춤",
      lead: "멈춤/타임아웃은 빠르게 리셋하세요.",
      steps: ["같은 버튼 반복 터치 금지", "이전 단계로 돌아가거나 재시작", "줄이 길면 카운터로 이동"],
      whyItems: ["세션 타임아웃", "단말 응답 지연"],
      blockedItems: ["한 번 재시작 후 계속 멈추면 카운터로 이동하세요."],
      phrase: "화면이 멈췄어요. 카운터에서 주문할게요.",
    };
  }

  if (lang === "ja") {
    const common = {
      back: "キオスクへ",
      whatNow: "今すぐやること",
      why: "なぜ起きるか",
      blocked: "詰まったら",
      show: "スタッフに見せる",
      phraseLabel: "現場フレーズ",
      sim: "キオスク練習",
    };
    if (issue === "card-rejected") {
      return {
        ...common,
        title: "カード拒否",
        lead: "焦らず、この順番で進めてください。",
        steps: ["挿入よりタッチ決済を先に", "別カードを1回試す", "カウンター決済を依頼"],
        whyItems: ["海外カードPIN非対応端末", "オフライン端末の問題", "会員画面の割り込み"],
        blockedItems: ["すぐにカウンター決済へ切り替えてください。"],
        phrase: "카운터 결제 가능할까요?",
      };
    }
    if (issue === "no-english") {
      return {
        ...common,
        title: "英語表示なし",
        lead: "短く確認して、すぐ動きます。",
        steps: ["右上のLANGを探す", "無ければカウンターへ移動"],
        whyItems: ["ブランドごとに言語ボタン位置が違う", "加盟店UIバージョン差"],
        blockedItems: ["スタッフに言語切替またはカウンター決済を依頼。"],
        phrase: "영어 메뉴 있나요?",
      };
    }
    if (issue === "phone-number") {
      return {
        ...common,
        title: "電話番号入力画面",
        lead: "支払い必須ではなく会員フローの可能性が高いです。",
        steps: ["会員登録をスキップ", "ゲスト決済を選ぶ", "可能なら電話番号は空欄"],
        whyItems: ["会員登録の誘導画面", "ポイント用の入力項目"],
        blockedItems: ["進まなければカウンター決済へ。"],
        phrase: "비회원 결제 가능할까요?",
      };
    }
    return {
      ...common,
      title: "画面フリーズ",
      lead: "フリーズ/タイムアウト時はすぐリセット。",
      steps: ["同じボタン連打を止める", "1段戻るか再起動", "列が長ければカウンターへ"],
      whyItems: ["セッションタイムアウト", "端末応答遅延"],
      blockedItems: ["1回再起動しても同じならカウンターへ。"],
      phrase: "화면이 멈췄어요. 카운터에서 주문할게요.",
    };
  }

  if (lang === "zh-cn") {
    const common = {
      back: "返回点餐机",
      whatNow: "现在先做",
      why: "为什么会发生",
      blocked: "如果仍卡住",
      show: "给店员看",
      phraseLabel: "现场短句",
      sim: "点餐机模拟练习",
    };
    if (issue === "card-rejected") {
      return {
        ...common,
        title: "刷卡失败",
        lead: "别慌，按这个顺序处理。",
        steps: ["先试感应，不先插卡", "换另一张卡再试一次", "请求柜台结账"],
        whyItems: ["部分设备不支持海外PIN", "终端离线问题", "会员页面中断流程"],
        blockedItems: ["立即改为柜台结账。"],
        phrase: "카운터 결제 가능할까요?",
      };
    }
    if (issue === "no-english") {
      return {
        ...common,
        title: "没有英文选项",
        lead: "快速确认后立刻切换方案。",
        steps: ["先找右上角LANG", "没有按钮就去柜台"],
        whyItems: ["不同品牌隐藏语言按钮", "加盟店UI版本不同"],
        blockedItems: ["请店员切换语言或直接柜台结账。"],
        phrase: "영어 메뉴 있나요?",
      };
    }
    if (issue === "phone-number") {
      return {
        ...common,
        title: "要求输入手机号",
        lead: "这通常是会员流程，不是付款必填。",
        steps: ["跳过会员", "选择游客/非会员付款", "可留空则手机号留空"],
        whyItems: ["会员导流页面", "仅积分功能需要手机号"],
        blockedItems: ["仍被拦截就改柜台结账。"],
        phrase: "비회원 결제 가능할까요?",
      };
    }
    return {
      ...common,
      title: "屏幕卡住",
      lead: "卡住或超时时，马上重置。",
      steps: ["不要反复点同一按钮", "返回上一步或重开", "排队变长就去柜台"],
      whyItems: ["会话超时", "终端响应慢"],
      blockedItems: ["重开一次仍卡住就改柜台。"],
      phrase: "화면이 멈췄어요. 카운터에서 주문할게요.",
    };
  }

  if (lang === "zh-tw" || lang === "zh-hk") {
    const common = {
      back: "返回點餐機",
      whatNow: "現在先做",
      why: "為什麼會發生",
      blocked: "如果仍卡住",
      show: "給店員看",
      phraseLabel: "現場短句",
      sim: "點餐機模擬練習",
    };
    if (issue === "card-rejected") {
      return {
        ...common,
        title: "刷卡失敗",
        lead: "先別慌，按這個順序處理。",
        steps: ["先試感應，不先插卡", "換另一張卡再試一次", "請店員改櫃檯結帳"],
        whyItems: ["部分設備不支援海外PIN", "終端離線問題", "會員畫面中斷流程"],
        blockedItems: ["立即改為櫃檯結帳。"],
        phrase: "카운터 결제 가능할까요?",
      };
    }
    if (issue === "no-english") {
      return {
        ...common,
        title: "沒有英文選項",
        lead: "快速確認後立刻切換方案。",
        steps: ["先找右上角LANG", "沒有按鈕就去櫃檯"],
        whyItems: ["不同品牌隱藏語言按鈕", "加盟店UI版本不同"],
        blockedItems: ["請店員切換語言或直接櫃檯結帳。"],
        phrase: "영어 메뉴 있나요?",
      };
    }
    if (issue === "phone-number") {
      return {
        ...common,
        title: "要求輸入手機號",
        lead: "這通常是會員流程，不是付款必填。",
        steps: ["跳過會員", "選擇訪客/非會員付款", "可留空則手機號留空"],
        whyItems: ["會員導流畫面", "僅積分功能需要手機號"],
        blockedItems: ["仍被攔截就改櫃檯結帳。"],
        phrase: "비회원 결제 가능할까요?",
      };
    }
    return {
      ...common,
      title: "畫面卡住",
      lead: "卡住或逾時時，馬上重置。",
      steps: ["不要重複點同一按鈕", "返回上一步或重開", "排隊變長就去櫃檯"],
      whyItems: ["工作階段逾時", "終端回應慢"],
      blockedItems: ["重開一次仍卡住就改櫃檯。"],
      phrase: "화면이 멈췄어요. 카운터에서 주문할게요.",
    };
  }

  const common = {
    back: "Back to Kiosk",
    whatNow: "WHAT TO DO NOW",
    why: "WHY IT HAPPENS",
    blocked: "IF BLOCKED",
    show: "SHOW THIS",
    phraseLabel: "Show this to staff",
    sim: "Try kiosk simulation",
  };
  if (issue === "card-rejected") {
    return {
      ...common,
      title: "Card rejected",
      lead: "Don’t panic. Try this order.",
      steps: ["Tap first (not insert)", "Try another card once", "Ask for counter payment"],
      whyItems: ["Some kiosks don’t support overseas PIN", "Offline terminal issue", "Membership screen interruption"],
      blockedItems: ["Ask for counter payment immediately."],
      phrase: "카운터 결제 가능할까요?",
    };
  }
  if (issue === "no-english") {
    return {
      ...common,
      title: "No English option",
      lead: "Keep it short. Move fast.",
      steps: ["Look for “LANG” top right", "If no button -> go to counter"],
      whyItems: ["Some brands hide language button", "Franchise version differences"],
      blockedItems: ["Ask staff to switch language or use counter."],
      phrase: "영어 메뉴 있나요?",
    };
  }
  if (issue === "phone-number") {
    return {
      ...common,
      title: "Asking for phone number",
      lead: "Treat it as membership flow, not mandatory payment.",
      steps: ["Skip membership", "Choose guest payment", "Leave phone field empty if possible"],
      whyItems: ["Membership upsell screen", "Required field for points only"],
      blockedItems: ["Ask for counter payment."],
      phrase: "비회원 결제 가능할까요?",
    };
  }
  return {
    ...common,
    title: "Screen stuck",
    lead: "Reset fast when it freezes or times out.",
    steps: ["Do not keep tapping same button", "Go back one step or restart", "Move to counter if queue builds"],
    whyItems: ["Session timeout", "Slow terminal response"],
    blockedItems: ["Restart once. If still stuck, move to counter."],
    phrase: "화면이 멈췄어요. 카운터에서 주문할게요.",
  };
}

export default async function NowKioskIssuePage({ params }: PageProps) {
  const { lang, issue } = await params;
  if (!isLang(lang) || !isIssueId(issue)) notFound();

  const locale = lang as Lang;
  const c = copy(locale, issue);

  return (
    <Container className="py-10 sm:py-14">
      <Link href={`/${locale}/now/kiosk`} className="text-sm font-semibold text-zinc-600">
        {c.back}
      </Link>

      <section className="mt-4 rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{c.title}</h1>
        <p className="mt-3 text-sm font-semibold text-zinc-300">{c.lead}</p>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4">
        <h2 className="text-xs font-black uppercase tracking-[0.14em] text-zinc-900">{c.whatNow}</h2>
        <ol className="space-y-2 text-sm font-semibold text-zinc-900">
          {c.steps.map((step, index) => (
            <li key={step}>
              {index + 1}. {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-3 rounded-2xl border border-zinc-200 bg-white p-4">
        <h2 className="text-xs font-black uppercase tracking-[0.14em] text-zinc-900">{c.why}</h2>
        <ul className="mt-2 space-y-1.5 text-sm font-semibold text-zinc-800">
          {c.whyItems.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-3 rounded-2xl border border-zinc-200 bg-white p-4">
        <h2 className="text-xs font-black uppercase tracking-[0.14em] text-zinc-900">{c.blocked}</h2>
        <ul className="mt-2 space-y-1.5 text-sm font-semibold text-zinc-800">
          {c.blockedItems.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-3 rounded-2xl border border-zinc-900 bg-zinc-50 p-4">
        <h2 className="text-xs font-black uppercase tracking-[0.14em] text-zinc-900">{c.show}</h2>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-zinc-600">{c.phraseLabel}</p>
        <p className="mt-2 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">{c.phrase}</p>
      </section>

      <div className="mt-4">
        <Link href={`/${locale}/tools/kiosk-practice`} className="inline-flex rounded-full border border-zinc-900 px-4 py-2 text-sm font-black text-zinc-900">
          {c.sim}
        </Link>
      </div>
    </Container>
  );
}
