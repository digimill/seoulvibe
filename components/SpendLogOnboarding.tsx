"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "sv-spend-log-onboarding-v1";

type SpendLogOnboardingProps = {
  useTitle: string;
  useBody: string;
  diffTitle: string;
  diffBody: string;
};

export function SpendLogOnboarding({ useTitle, useBody, diffTitle, diffBody }: SpendLogOnboardingProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setShow(true);
      localStorage.setItem(STORAGE_KEY, "1");
    }
  }, []);

  if (!show) return null;

  return (
    <section className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-700">{useTitle}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-700">{useBody}</p>
      <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-zinc-700">{diffTitle}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-700">{diffBody}</p>
    </section>
  );
}
