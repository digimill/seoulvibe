"use client";

import { useState } from "react";

type CopyPhraseButtonProps = {
  text: string;
};

export function CopyPhraseButton({ text }: CopyPhraseButtonProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100"
      aria-label={`Copy phrase: ${text}`}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
