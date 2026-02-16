"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";

type CopyPhraseButtonProps = {
  english: string;
  korean: string;
  locale: Lang;
};

function getCopy(locale: Lang) {
  if (locale === "ko") {
    return {
      show: "한국어 크게 보기",
      hide: "닫기",
      play: "음성 재생",
      stop: "음성 중지",
      hint: "직원에게 이 문구를 가로 화면으로 보여주세요",
      rotate: "더 잘 보이게 휴대폰을 가로로 돌려주세요",
      aria: "한국어 문구 보기",
    };
  }
  if (locale === "ja") {
    return {
      show: "韓国語を大きく表示",
      hide: "閉じる",
      play: "音声を再生",
      stop: "音声を停止",
      hint: "スタッフに横向きで見せてください",
      rotate: "見やすくするため横向きにしてください",
      aria: "韓国語フレーズを表示",
    };
  }
  if (locale === "zh-cn") {
    return {
      show: "放大显示韩语",
      hide: "关闭",
      play: "播放语音",
      stop: "停止语音",
      hint: "请横屏给店员看这句话",
      rotate: "建议横屏展示，店员更容易看清",
      aria: "显示韩语句子",
    };
  }
  if (locale === "zh-tw" || locale === "zh-hk") {
    return {
      show: "放大顯示韓語",
      hide: "關閉",
      play: "播放語音",
      stop: "停止語音",
      hint: "請橫屏給店員看這句話",
      rotate: "建議橫屏展示，店員更容易看清",
      aria: "顯示韓語句子",
    };
  }
  return {
    show: "Show Korean large",
    hide: "Close",
    play: "Play audio",
    stop: "Stop audio",
    hint: "Show this in landscape to staff",
    rotate: "Rotate to landscape for better readability",
    aria: "Show Korean phrase",
  };
}

export function CopyPhraseButton({ english, korean, locale }: CopyPhraseButtonProps) {
  const [open, setOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const t = getCopy(locale);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const onSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(korean);
    utterance.lang = "ko-KR";
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-zinc-950 bg-zinc-900 px-3 py-1 text-xs font-bold text-white transition hover:bg-zinc-800"
        aria-label={`${t.aria}: ${english}`}
      >
        {t.show}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[90] bg-zinc-950 text-white">
          <div className="flex h-full flex-col p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-zinc-300 sm:text-sm">{t.rotate}</p>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined" && "speechSynthesis" in window) {
                    window.speechSynthesis.cancel();
                  }
                  setSpeaking(false);
                  setOpen(false);
                }}
                className="rounded-lg border border-zinc-600 px-3 py-2 text-sm font-bold"
              >
                {t.hide}
              </button>
            </div>

            <div className="mt-4 flex-1 rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-4 sm:p-8">
              <div className="flex h-full flex-col justify-center">
                <div className="mx-auto flex w-full max-w-5xl items-center justify-center rounded-2xl border border-zinc-600 bg-black px-5 py-8 sm:px-10 sm:py-12">
                  <p className="text-center text-4xl font-black leading-tight tracking-tight sm:text-6xl md:text-7xl">
                    {korean}
                  </p>
                </div>
                <p className="mt-4 text-center text-sm font-semibold text-zinc-300 sm:text-base">{t.hint}</p>
                {locale === "en" ? <p className="mt-2 text-center text-xs font-medium text-zinc-400">{english}</p> : null}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onSpeak}
                className="rounded-full border border-zinc-500 px-4 py-2 text-sm font-bold"
              >
                {speaking ? t.stop : t.play}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
