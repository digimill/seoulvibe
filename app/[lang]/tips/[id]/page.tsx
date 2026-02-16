import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { CopyPhraseButton } from "@/components/CopyPhraseButton";
import { TagBadge } from "@/components/TagBadge";
import { getTips } from "@/lib/content";
import { getCopy, isLang, type Lang } from "@/lib/i18n";
import { toSpotLink } from "@/lib/maps";

type TipDetailPageProps = {
  params: Promise<{ lang: string; id: string }>;
};

function TriadCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5">
      <h2 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-900">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-zinc-800">{children}</div>
    </section>
  );
}

function KioskEmergency({ locale }: { locale: Lang }) {
  const c =
    locale === "ko"
      ? {
          title: "키오스크 카드가 거절됐어요",
          lead: "당황하지 말고 순서대로 처리하세요.",
          now: "지금 바로 할 일",
          noEn: "영어 옵션이 없나요?",
          phone: "전화번호를 물어보나요?",
          wrong: "자주 막히는 지점",
          why: "왜 생기나",
          show: "직원에게 보여줄 한국어 문구",
          more: "자세한 버전",
          backPractice: "키오스크 체험으로 돌아가기",
          moreLink: "키오스크 전체 가이드 보기",
          do1: "삽입 말고 탭 결제를 먼저 시도",
          do2: "다른 카드로 한 번 더 시도",
          do3: "직원에게 \"카운터 결제 가능한가요?\"라고 요청",
          en1: "오른쪽 위 언어 버튼 확인",
          en2: "없으면 바로 카운터로 이동",
          p1: "멤버십 가입은 건너뛰기",
          p2: "비회원 결제 선택",
          wrongBody: "삽입 결제 실패, 영어 없음, 전화번호 입력에서 멈춤",
          whyBody: "단말 차이 + 언어 숨김 UI + 멤버십 유도 화면",
        }
      : locale === "ja"
        ? {
            title: "キオスクでカードが通らない",
            lead: "焦らず、順番どおりに処理。",
            now: "今すぐやること",
            noEn: "英語表示がない？",
            phone: "電話番号を求められる？",
            wrong: "よく詰まる点",
            why: "なぜ起きるか",
            show: "スタッフに見せる韓国語フレーズ",
            more: "詳細版",
            backPractice: "キオスク体験に戻る",
            moreLink: "キオスク完全ガイド",
            do1: "挿入より先にタッチ決済を試す",
            do2: "別カードを1回試す",
            do3: "「カウンターで払えますか？」と聞く",
            en1: "右上の言語ボタンを確認",
            en2: "なければカウンターへ移動",
            p1: "会員登録はスキップ",
            p2: "ゲスト会計を選ぶ",
            wrongBody: "挿入失敗、英語なし、電話番号入力で停止",
            whyBody: "端末差 + 言語UIの分かりづらさ + 会員誘導画面",
          }
        : locale === "zh-cn"
          ? {
              title: "自助机刷卡失败",
              lead: "别慌，按顺序处理。",
              now: "现在先做",
              noEn: "没有英文选项？",
              phone: "要求输入手机号？",
              wrong: "常见卡点",
              why: "为什么会发生",
              show: "给店员看的韩语句子",
              more: "详细版",
              backPractice: "返回自助机体验",
              moreLink: "查看完整自助机指南",
              do1: "先试 tap，不要先插卡",
              do2: "换一张卡再试一次",
              do3: "直接问店员：可以柜台付款吗？",
              en1: "先看右上角语言按钮",
              en2: "没有就直接去柜台",
              p1: "跳过会员注册",
              p2: "选择游客/访客结算",
              wrongBody: "插卡失败、没英文、卡在手机号页面",
              whyBody: "终端差异 + 语言入口隐藏 + 会员流程干扰",
            }
          : locale === "zh-tw" || locale === "zh-hk"
            ? {
                title: "自助機刷卡失敗",
                lead: "先別慌，照順序處理。",
                now: "現在先做",
                noEn: "沒有英文選項？",
                phone: "要求輸入手機號？",
                wrong: "常見卡點",
                why: "為什麼會發生",
                show: "給店員看的韓語句子",
                more: "詳細版",
                backPractice: "返回自助機體驗",
                moreLink: "查看完整自助機指南",
                do1: "先試 tap，不要先插卡",
                do2: "換一張卡再試一次",
                do3: "直接問店員：可以櫃檯付款嗎？",
                en1: "先看右上角語言按鈕",
                en2: "沒有就直接去櫃檯",
                p1: "跳過會員註冊",
                p2: "選擇訪客結帳",
                wrongBody: "插卡失敗、沒英文、卡在手機號頁面",
                whyBody: "終端差異 + 語言入口隱藏 + 會員流程干擾",
              }
            : {
                title: "Card rejected at kiosk",
                lead: "Don't freeze. Use this order.",
                now: "What to do immediately?",
                noEn: "No English option?",
                phone: "Asking phone number?",
                wrong: "What usually goes wrong?",
                why: "Why it happens?",
                show: "Show Korean phrases to staff",
                more: "Need full detail?",
                backPractice: "Back to kiosk practice",
                moreLink: "Read the complete kiosk guide",
                do1: "Try tap instead of insert.",
                do2: "Try another card.",
                do3: "Ask: \"Can I pay at the counter?\"",
                en1: "Look top-right for language.",
                en2: "If none, use counter.",
                p1: "Skip membership.",
                p2: "Choose guest checkout.",
                wrongBody: "Card insert fails. No English menu. Kiosk asks for phone number.",
                whyBody: "Some cards fail by insert chip. Some kiosks hide language in top-right. Phone prompt is often membership signup.",
              };
  const phrases =
    locale === "ko"
      ? [
          { label: "카운터 결제 가능 여부", english: "Can I pay at the counter?", korean: "카운터에서 결제할 수 있을까요?" },
          { label: "카드 오류 전달", english: "My card is not working here.", korean: "여기서 제 카드가 안 돼요." },
          { label: "비회원 결제 요청", english: "Can I skip membership and check out as guest?", korean: "회원가입 없이 비회원으로 결제할게요." },
          { label: "영어 옵션 확인", english: "Is there an English option?", korean: "영어 옵션 있나요?" },
        ]
      : locale === "ja"
        ? [
            { label: "カウンター決済を確認", english: "Can I pay at the counter?", korean: "카운터에서 결제할 수 있을까요?" },
            { label: "カードエラーを伝える", english: "My card is not working here.", korean: "여기서 제 카드가 안 돼요." },
            { label: "ゲスト会計を依頼", english: "Can I skip membership and check out as guest?", korean: "회원가입 없이 비회원으로 결제할게요." },
            { label: "英語表示を確認", english: "Is there an English option?", korean: "영어 옵션 있나요?" },
          ]
        : locale === "zh-cn"
          ? [
              { label: "确认柜台付款", english: "Can I pay at the counter?", korean: "카운터에서 결제할 수 있을까요?" },
              { label: "说明刷卡失败", english: "My card is not working here.", korean: "여기서 제 카드가 안 돼요." },
              { label: "申请游客结算", english: "Can I skip membership and check out as guest?", korean: "회원가입 없이 비회원으로 결제할게요." },
              { label: "确认英文选项", english: "Is there an English option?", korean: "영어 옵션 있나요?" },
            ]
          : locale === "zh-tw" || locale === "zh-hk"
            ? [
                { label: "確認櫃檯付款", english: "Can I pay at the counter?", korean: "카운터에서 결제할 수 있을까요?" },
                { label: "說明刷卡失敗", english: "My card is not working here.", korean: "여기서 제 카드가 안 돼요." },
                { label: "申請訪客結帳", english: "Can I skip membership and check out as guest?", korean: "회원가입 없이 비회원으로 결제할게요." },
                { label: "確認英文選項", english: "Is there an English option?", korean: "영어 옵션 있나요?" },
              ]
            : [
                { label: "Can I pay at the counter?", english: "Can I pay at the counter?", korean: "카운터에서 결제할 수 있을까요?" },
                { label: "My card is not working here.", english: "My card is not working here.", korean: "여기서 제 카드가 안 돼요." },
                { label: "Can I skip membership and check out as guest?", english: "Can I skip membership and check out as guest?", korean: "회원가입 없이 비회원으로 결제할게요." },
                { label: "Is there an English option?", english: "Is there an English option?", korean: "영어 옵션 있나요?" },
              ];

  return (
    <>
      <section className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{c.title}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">{c.lead}</p>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">{c.now}</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-800">
          <li>{c.do1}</li>
          <li>{c.do2}</li>
          <li>{c.do3}</li>
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">{c.noEn}</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-800">
          <li>{c.en1}</li>
          <li>{c.en2}</li>
        </ul>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">{c.phone}</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-800">
          <li>{c.p1}</li>
          <li>{c.p2}</li>
        </ul>
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2">
        <TriadCard title={c.wrong}>
          {c.wrongBody}
        </TriadCard>
        <TriadCard title={c.why}>
          {c.whyBody}
        </TriadCard>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">{c.show}</h2>
        <div className="mt-3 space-y-3">
          {phrases.map((phrase) => (
            <div key={phrase.label} className="rounded-xl border border-zinc-200 p-3">
              <p className="mb-2 text-sm font-semibold text-zinc-900">{phrase.label}</p>
              <CopyPhraseButton english={phrase.english} korean={phrase.korean} locale={locale} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-2 sm:grid-cols-2">
        <Link href={`/${locale}/tools/kiosk-practice`} className="rounded-2xl border border-zinc-900 bg-zinc-900 px-4 py-3 text-center text-sm font-black text-white">
          {c.backPractice}
        </Link>
        <Link href={`/${locale}/kiosk-card-rejected`} className="rounded-2xl border border-zinc-900 px-4 py-3 text-center text-sm font-black text-zinc-900">
          {c.moreLink}
        </Link>
      </section>
    </>
  );
}

function SubwayEmergency({ locale }: { locale: Lang }) {
  const c =
    locale === "ko"
      ? { title: "어떤 지하철 노선을 타야 할까?", lead: "현재 위치보다 숙소 기준으로 먼저 잡으세요.", stay: "숙소가 여기라면:", wrong: "자주 생기는 실수", why: "왜 헷갈리나", now: "지금 바로 할 일", missed: "역을 놓쳤다면?", more: "교통/잔액 문제라면", moreLink: "티머니 가이드 보기", wrongBody: "방향 반대로 타서 20~40분 손해가 자주 납니다.", whyBody: "색만 보고 판단하고, 종착역 확인을 건너뜁니다.", n1: "노선 색보다 종착역 이름 확인", n2: "2호선은 양방향 순환", n3: "헷갈리면 개찰구 들어가기 전에 질문", m1: "다음 역에서 내리기", m2: "반대 방향 열차로 갈아타기", m3: "환승 시간 안이면 추가 요금 거의 없음" }
      : locale === "ja"
        ? { title: "どの地下鉄路線に乗る？", lead: "今いる場所より宿の位置を基準に。", stay: "滞在先がここなら:", wrong: "よくあるミス", why: "なぜ迷うか", now: "今すぐやること", missed: "降りる駅を過ぎたら？", more: "残高・移動で詰まったら", moreLink: "T-moneyガイド", wrongBody: "方向違いに乗って20-40分失うケースが多い。", whyBody: "色だけ見て終点確認を飛ばすため。", n1: "路線色より終点名を確認", n2: "2号線は両方向に回る", n3: "迷ったら改札前で聞く", m1: "次の駅で降りる", m2: "反対方向へ乗り換え", m3: "乗換時間内なら追加料金は通常なし" }
        : locale === "zh-cn"
          ? { title: "现在该坐哪条地铁？", lead: "先按住宿位置选线，不要按当前站点。", stay: "如果你住在：", wrong: "常见失误", why: "为什么会迷路", now: "现在先做", missed: "坐过站了？", more: "余额/交通卡住时", moreLink: "看 T-money 指南", wrongBody: "坐反方向，常常直接多花 20-40 分钟。", whyBody: "只看线路颜色，不看终点站名。", n1: "先看终点站名，不先看颜色", n2: "2号线是双向环线", n3: "不确定就先问再进站", m1: "下一站下车", m2: "换乘反方向列车", m3: "在换乘时间内通常不额外加价" }
          : locale === "zh-tw" || locale === "zh-hk"
            ? { title: "現在該搭哪條地鐵？", lead: "先以住宿位置選線，不要只看當前站。", stay: "如果你住在：", wrong: "常見失誤", why: "為什麼會搞混", now: "現在先做", missed: "坐過站了？", more: "餘額/交通卡住時", moreLink: "看 T-money 指南", wrongBody: "搭錯方向，常常直接多花 20-40 分鐘。", whyBody: "只看線路顏色，不看終點站名。", n1: "先看終點站名，不先看顏色", n2: "2號線是雙向環線", n3: "不確定就先問再進站", m1: "下一站下車", m2: "改搭反方向列車", m3: "在轉乘時間內通常不加價" }
            : { title: "Which subway line should I take?", lead: "Start from where you sleep, not where you are.", stay: "If you are staying in:", wrong: "What usually goes wrong?", why: "Why it happens?", now: "What to do immediately?", missed: "Missed stop?", more: "Card or balance issue?", moreLink: "Check T-money planning", wrongBody: "People board the wrong direction and lose 20 to 40 minutes.", whyBody: "They check color only. They skip final station name.", n1: "Ignore line color. Check the last station name.", n2: "Line 2 goes both ways.", n3: "If unsure, ask before entering.", m1: "Get off next station.", m2: "Take opposite train.", m3: "No extra charge within transfer window." };
  const stayLines =
    locale === "ko"
      ? ["홍대 -> 2호선", "강남 -> 2호선", "북촌 -> 3호선", "공항 -> AREX"]
      : locale === "ja"
        ? ["弘大 -> 2号線", "江南 -> 2号線", "北村 -> 3号線", "空港 -> AREX"]
        : locale === "zh-cn"
          ? ["弘大 -> 2号线", "江南 -> 2号线", "北村 -> 3号线", "机场 -> AREX"]
          : locale === "zh-tw" || locale === "zh-hk"
            ? ["弘大 -> 2號線", "江南 -> 2號線", "北村 -> 3號線", "機場 -> AREX"]
            : ["Hongdae -> Line 2", "Gangnam -> Line 2", "Bukchon -> Line 3", "Airport -> AREX"];
  return (
    <>
      <section className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{c.title}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">{c.lead}</p>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">{c.stay}</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-800">
          {stayLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-3">
        <TriadCard title={c.wrong}>{c.wrongBody}</TriadCard>
        <TriadCard title={c.why}>{c.whyBody}</TriadCard>
        <TriadCard title={c.now}>
          <ul className="space-y-2 font-semibold">
            <li>{c.n1}</li>
            <li>{c.n2}</li>
            <li>{c.n3}</li>
          </ul>
        </TriadCard>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">{c.missed}</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-800">
          <li>{c.m1}</li>
          <li>{c.m2}</li>
          <li>{c.m3}</li>
        </ul>
      </section>

      <section className="mt-6 text-sm font-semibold text-zinc-700">
        {c.more} <Link href={`/${locale}/how-much-tmoney`} className="underline">{c.moreLink}</Link>.
      </section>
    </>
  );
}

function OliveYoungEmergency({ locale }: { locale: Lang }) {
  const c =
    locale === "ko"
      ? { title: "올리브영 30분만 있다면", lead: "시간 끌지 말고 기본 세트 먼저.", wrong: "자주 꼬이는 지점", why: "왜 생기나", now: "지금 바로 할 일", before: "결제 전 체크", more: "자세한 버전", moreLink: "올리브영 가이드 보기", wrongBody: "한 시간 쓰고도 랜덤템만 사는 경우가 많아요.", whyBody: "신상품/테스터/유행 리스트가 너무 많아 판단이 흔들립니다.", nowBody: "기본 세트 먼저 담고 거기서 멈추세요." }
      : locale === "ja"
        ? { title: "オリーブヤングが30分しかないなら", lead: "迷わず基本セットを先に。", wrong: "よくある失敗", why: "なぜ起きる", now: "今すぐやること", before: "会計前チェック", more: "詳細版", moreLink: "オリーブヤングガイド", wrongBody: "1時間使っても流行品だけ買って終わる。", whyBody: "新作・テスター・SNS情報が多すぎて判断が散る。", nowBody: "まず基本セットを確保して止める。" }
        : locale === "zh-cn"
          ? { title: "如果你在 Olive Young 只有 30 分钟", lead: "别陷入选品地狱，先拿基础套装。", wrong: "常见问题", why: "为什么会发生", now: "现在先做", before: "付款前确认", more: "详细版", moreLink: "查看 Olive Young 指南", wrongBody: "花一小时却只买了随机网红款。", whyBody: "新品太多、试用太多、社媒清单太杂。", nowBody: "先拿基础组合，然后立刻收手。" }
          : locale === "zh-tw" || locale === "zh-hk"
            ? { title: "如果你在 Olive Young 只有 30 分鐘", lead: "先拿基本組合，不要陷入選品地獄。", wrong: "常見問題", why: "為什麼會發生", now: "現在先做", before: "付款前確認", more: "詳細版", moreLink: "查看 Olive Young 指南", wrongBody: "花一小時卻只買了隨機網紅品。", whyBody: "新品太多、試用太多、社群清單太雜。", nowBody: "先拿基本組合，然後立刻收手。" }
            : { title: "If you only have 30 minutes at Olive Young", lead: "Skip the rabbit hole. Buy what works.", wrong: "What usually goes wrong?", why: "Why it happens?", now: "What to do immediately?", before: "Before you pay", more: "Full breakdown:", moreLink: "Olive Young tourist guide", wrongBody: "People spend an hour and leave with random hype items they never use.", whyBody: "Too many launches. Too many testers. Social media lists can derail quick decisions.", nowBody: "Buy the basic set first. Then stop." };
  const packTitle =
    locale === "ko"
      ? "5만원대 스타터 팩"
      : locale === "ja"
        ? "50ドル前後スターターパック"
        : locale === "zh-cn"
          ? "50 美元入门清单"
          : locale === "zh-tw" || locale === "zh-hk"
            ? "50 美元入門清單"
            : "$50 starter pack";
  const packItems =
    locale === "ko"
      ? ["클렌저", "토너", "시트마스크 번들", "립 틴트"]
      : locale === "ja"
        ? ["クレンザー", "トナー", "シートマスクセット", "リップティント"]
        : locale === "zh-cn"
          ? ["洁面", "化妆水", "面膜组合", "唇釉"]
          : locale === "zh-tw" || locale === "zh-hk"
            ? ["潔面", "化妝水", "面膜組合", "唇釉"]
            : ["Cleanser", "Toner", "Sheet mask bundle", "Lip tint"];
  const skipTitle =
    locale === "ko"
      ? "건너뛸 것"
      : locale === "ja"
        ? "避けるもの"
        : locale === "zh-cn"
          ? "先跳过"
          : locale === "zh-tw" || locale === "zh-hk"
            ? "先跳過"
            : "Skip";
  const skipItems =
    locale === "ko"
      ? ["10단계 루틴", "무작위 유행템", "영문 표기 없는 제품"]
      : locale === "ja"
        ? ["10ステップのフルルーティン", "流行だけの衝動買い", "英語ラベルがない商品"]
        : locale === "zh-cn"
          ? ["10 步全套护理", "随机网红品", "没有英文标识的产品"]
          : locale === "zh-tw" || locale === "zh-hk"
            ? ["10 步驟完整護膚", "隨機網紅品", "沒有英文標示的產品"]
            : ["10-step routines", "Random trending items", "Products without English label"];
  const beforeItems =
    locale === "ko"
      ? ["택스리펀 가능", "여권 필요", "주요 카드 결제 가능"]
      : locale === "ja"
        ? ["免税対応あり", "パスポート必須", "主要カード利用可"]
        : locale === "zh-cn"
          ? ["可办退税", "需要护照", "支持主流信用卡"]
          : locale === "zh-tw" || locale === "zh-hk"
            ? ["可辦退稅", "需要護照", "支援主要信用卡"]
            : ["Tax refund possible", "Passport required", "Major cards accepted"];
  return (
    <>
      <section className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{c.title}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">{c.lead}</p>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <TriadCard title={c.wrong}>{c.wrongBody}</TriadCard>
        <TriadCard title={c.why}>{c.whyBody}</TriadCard>
        <TriadCard title={c.now}>
          {c.nowBody}
        </TriadCard>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">{packTitle}</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-800">
          {packItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">{skipTitle}</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-800">
          {skipItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">{c.before}</h2>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-800">
          {beforeItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6 text-sm font-semibold text-zinc-700">
        {c.more} <Link href={`/${locale}/olive-young-tourist-guide`} className="underline">{c.moreLink}</Link>.
      </section>
    </>
  );
}

export default async function TipDetailPage({ params }: TipDetailPageProps) {
  const { lang, id } = await params;
  if (!isLang(lang)) notFound();

  const locale = lang as Lang;
  const t = getCopy(locale);
  const isKiosk = id === "kiosk-survival-flow";
  const isSubway = id === "subway-map-confusion-cuts";
  const isOliveYoung = id === "oliveyoung-master-playbook";
  const tip = isKiosk || isSubway || isOliveYoung ? null : (await getTips(locale)).find((item) => item.id === id);
  const common =
    locale === "ko"
      ? { wrong: "자주 꼬이는 지점", why: "왜 생기나", now: "지금 바로 할 일", nearby: "근처에서 바로 갈 곳", fallbackWhy: "로컬 맥락 없이 정보만 복사하면 일정이 쉽게 꼬입니다.", fallbackNow: "멈추고, 순서를 다시 잡고, 다음 한 단계만 실행하세요." }
      : locale === "ja"
        ? { wrong: "よく詰まる点", why: "なぜ起きるか", now: "今すぐやること", nearby: "近くで使える場所", fallbackWhy: "ローカル文脈なしで情報をなぞると失敗しやすいです。", fallbackNow: "いったん止まって順番を整え、次の1手だけ実行。"}
        : locale === "zh-cn"
          ? { wrong: "常见卡点", why: "为什么会发生", now: "现在先做", nearby: "附近可用地点", fallbackWhy: "脱离本地语境照搬建议，最容易翻车。", fallbackNow: "先停一下，重排顺序，只做下一步。"}
          : locale === "zh-tw" || locale === "zh-hk"
            ? { wrong: "常見卡點", why: "為什麼會發生", now: "現在先做", nearby: "附近可用地點", fallbackWhy: "離開在地脈絡照抄建議，最容易出錯。", fallbackNow: "先停一下，重排順序，只做下一步。"}
            : { wrong: "What usually goes wrong?", why: "Why it happens?", now: "What to do immediately?", nearby: "Useful nearby places", fallbackWhy: "Visitors copy random advice without local context.", fallbackNow: "Slow down, reset, and use the shortest next action." };

  if (!tip && !isKiosk && !isSubway && !isOliveYoung) notFound();

  return (
    <Container className="py-10 sm:py-14">
      <Link href={`/${locale}/tips`} className="text-sm font-semibold text-zinc-600">
        {t.back}
      </Link>

      <div className="mt-4">
        {isKiosk ? <KioskEmergency locale={locale} /> : null}
        {isSubway ? <SubwayEmergency locale={locale} /> : null}
        {isOliveYoung ? <OliveYoungEmergency locale={locale} /> : null}

        {!isKiosk && !isSubway && !isOliveYoung && tip ? (
          <>
            <section className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{tip.title}</h1>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{tip.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tip.tags.map((tag) => (
                  <TagBadge key={tag}>{tag}</TagBadge>
                ))}
              </div>
            </section>

            <section className="mt-6 grid gap-4 sm:grid-cols-3">
              <TriadCard title={common.wrong}>{tip.what_to_know ?? tip.real_scene ?? tip.summary}</TriadCard>
              <TriadCard title={common.why}>{tip.why_it_matters ?? tip.local_move ?? common.fallbackWhy}</TriadCard>
              <TriadCard title={common.now}>{tip.quick_fix ?? tip.avoid_this ?? common.fallbackNow}</TriadCard>
            </section>

            {tip.real_spots && tip.real_spots.length > 0 ? (
              <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
                <h2 className="text-lg font-black tracking-tight text-zinc-950">{common.nearby}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-800">
                  {tip.real_spots
                    .map((spot) => {
                      const link = toSpotLink(spot);
                      return (
                        <a
                          key={link.name}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-700"
                        >
                          {link.name}
                        </a>
                      );
                    })
                    .reduce<ReactNode[]>((acc, node, index) => (index === 0 ? [node] : [...acc, " / ", node]), [])}
                </p>
              </section>
            ) : null}
          </>
        ) : null}
      </div>
    </Container>
  );
}
