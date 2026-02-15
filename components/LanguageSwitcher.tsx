"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LANGS, LANG_LABELS, type Lang } from "@/lib/i18n";

type LanguageSwitcherProps = {
  lang: Lang;
  className?: string;
  compact?: boolean;
};

const LANG_SHORT_LABELS: Record<Lang, string> = {
  en: "EN",
  ko: "KO",
  "zh-cn": "简",
  ja: "JP",
  "zh-tw": "繁",
  "zh-hk": "HK",
};

function toLocalizedHref(pathname: string, query: string, nextLang: Lang): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && LANGS.includes(segments[0] as Lang)) {
    segments[0] = nextLang;
    return `/${segments.join("/")}${query}`;
  }
  if (pathname === "/") {
    return `/${nextLang}${query}`;
  }
  return `/${nextLang}${pathname}${query}`;
}

export function LanguageSwitcher({ lang, className = "", compact = false }: LanguageSwitcherProps) {
  const pathname = usePathname() ?? `/${lang}`;
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const querySuffix = query ? `?${query}` : "";
  const currentLabel = compact ? LANG_SHORT_LABELS[lang] : LANG_LABELS[lang];

  return (
    <details className={`relative ${className}`.trim()}>
      <summary
        className={`list-none rounded-full border border-zinc-900 px-3 py-1 text-xs font-medium ${compact ? "text-zinc-900" : "bg-zinc-900 tracking-wide text-white"}`}
      >
        {currentLabel}
      </summary>
      <div className="absolute right-0 z-50 mt-2 min-w-44 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg">
        {LANGS.filter((item) => item !== lang).map((item) => (
          <Link
            key={item}
            href={toLocalizedHref(pathname, querySuffix, item)}
            className="block rounded-md px-3 py-2 text-xs text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            {LANG_LABELS[item]}
          </Link>
        ))}
      </div>
    </details>
  );
}
