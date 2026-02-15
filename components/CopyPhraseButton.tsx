"use client";

import { useState } from "react";

type CopyPhraseButtonProps = {
  english: string;
  korean: string;
};

export function CopyPhraseButton({ english, korean }: CopyPhraseButtonProps) {
  const [open, setOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);

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
        aria-label={`Show Korean phrase for: ${english}`}
      >
        {open ? "Hide Korean" : "Show Korean"}
      </button>
      {open ? (
        <div className="mt-3 rounded-xl border-2 border-zinc-900 bg-zinc-50 p-4">
          <p className="text-xl font-black leading-8 text-zinc-950 sm:text-2xl sm:leading-10">{korean}</p>
          <p className="mt-2 text-xs font-medium text-zinc-600">{english}</p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={onSpeak}
              className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-semibold text-zinc-700"
            >
              {speaking ? "Stop audio" : "Play audio"}
            </button>
            <p className="text-[11px] font-semibold text-zinc-500">Show this to staff</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
