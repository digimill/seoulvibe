"use client";

import { useEffect, useRef, useState } from "react";

type SpeakButtonProps = {
  text: string;
  lang?: string;
  idleLabel: string;
  speakingLabel: string;
};

export function SpeakButton({ text, lang = "ko-KR", idleLabel, speakingLabel }: SpeakButtonProps) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const onClick = () => {
    if (!supported || !text.trim()) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
    >
      {speaking ? speakingLabel : idleLabel}
    </button>
  );
}
