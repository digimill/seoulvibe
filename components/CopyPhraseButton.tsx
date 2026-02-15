"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";

type CopyPhraseButtonProps = {
  english: string;
  korean: string;
  locale: Lang;
};

function getCopy(locale: Lang) {
  if (locale === "ko") {
    return { show: "한국어 크게 보기", hide: "닫기", play: "음성 재생", stop: "음성 중지", hint: "직원에게 이 문구를 보여주세요", aria: "한국어 문구 보기" };
  }
  if (locale === "ja") {
    return { show: "韓国語を大きく表示", hide: "閉じる", play: "音声を再生", stop: "音声を停止", hint: "この文をスタッフに見せてください", aria: "韓国語フレーズを表示" };
  }
  if (locale === "zh-cn") {
    return { show: "放大显示韩语", hide: "收起", play: "播放语音", stop: "停止语音", hint: "把这句话给店员看", aria: "显示韩语句子" };
  }
  if (locale === "zh-tw" || locale === "zh-hk") {
    return { show: "放大顯示韓語", hide: "收起", play: "播放語音", stop: "停止語音", hint: "把這句話給店員看", aria: "顯示韓語句子" };
  }
  return { show: "Show Korean large", hide: "Hide", play: "Play audio", stop: "Stop audio", hint: "Show this sentence to staff", aria: "Show Korean phrase" };
}

export function CopyPhraseButton({ english, korean, locale }: CopyPhraseButtonProps) {
  const [open, setOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const t = getCopy(locale);

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
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full border border-zinc-950 bg-zinc-900 px-3 py-1 text-xs font-bold text-white transition hover:bg-zinc-800"
        aria-label={`${t.aria}: ${english}`}
      >
        {open ? t.hide : t.show}
      </button>
      {open ? (
        <div className="mt-3 rounded-xl border-2 border-zinc-900 bg-zinc-50 p-4">
          <p className="text-xl font-black leading-8 text-zinc-950 sm:text-2xl sm:leading-10">{korean}</p>
          {locale === "en" ? <p className="mt-2 text-xs font-medium text-zinc-600">{english}</p> : null}
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={onSpeak}
              className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-semibold text-zinc-700"
            >
              {speaking ? t.stop : t.play}
            </button>
            <p className="text-[11px] font-semibold text-zinc-500">{t.hint}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
