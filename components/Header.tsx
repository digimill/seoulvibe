"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Lang } from "@/lib/i18n";
import { copy } from "@/lib/i18n";
import { Container } from "@/components/Container";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

type HeaderProps = {
  lang: Lang;
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20L16.65 16.65" />
    </svg>
  );
}

export function Header({ lang }: HeaderProps) {
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const [languageCloseSignal, setLanguageCloseSignal] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const t = copy[lang];
  const labels =
    lang === "ko"
      ? { plan: "여행 전", now: "지금 해결", areas: "지역", search: "문제 인덱스", subtitle: "Seoul decision guide", menu: "메뉴" }
      : lang === "ja"
        ? { plan: "計画", now: "今すぐ解決", areas: "エリア", search: "問題インデックス", subtitle: "Seoul decision guide", menu: "メニュー" }
        : lang === "zh-cn"
          ? { plan: "规划", now: "即时解决", areas: "区域", search: "问题索引", subtitle: "Seoul decision guide", menu: "菜单" }
          : lang === "zh-tw" || lang === "zh-hk"
            ? { plan: "規劃", now: "即時解決", areas: "區域", search: "問題索引", subtitle: "Seoul decision guide", menu: "選單" }
            : { plan: "Plan", now: "Now", areas: "Areas", search: "Issue Index", subtitle: "Seoul decision guide", menu: "Menu" };

  const navItems = [
    { href: `/${lang}/plan`, label: labels.plan },
    { href: `/${lang}/now`, label: labels.now },
    { href: `/${lang}/areas`, label: labels.areas },
  ];

  useEffect(() => {
    if (mobileMenuRef.current) {
      mobileMenuRef.current.open = false;
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const probe = new window.Image();
    probe.onload = () => setShowLogo(true);
    probe.onerror = () => setShowLogo(false);
    probe.src = "/images/logo.png";
  }, []);

  const closeMobileMenu = () => {
    if (mobileMenuRef.current) {
      mobileMenuRef.current.open = false;
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur-xl">
      <Container className="py-2">
        <div className="flex min-h-16 items-center justify-between gap-3">
          <Link href={`/${lang}`} className="min-w-0 md:shrink-0">
            <div className="flex items-center gap-2">
              {showLogo ? (
                <img
                  src="/images/logo.png"
                  alt="Seoul Vibe logo"
                  className="block h-9 w-9 shrink-0 object-contain sm:h-8 sm:w-8"
                />
              ) : null}
              <div className="min-w-0 leading-tight">
                <span className="block text-sm font-bold tracking-normal">{t.appName}</span>
                <span className="mt-0.5 block max-w-[10rem] truncate text-[10px] font-semibold text-zinc-500 sm:max-w-none sm:text-[11px]">
                  {labels.subtitle}
                </span>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2 md:hidden">
            <Link href={`/${lang}/tips`} className="inline-flex items-center gap-1 rounded-full border border-zinc-300 px-2.5 py-1 text-xs font-semibold text-zinc-700">
              <SearchIcon />
              <span>{labels.search}</span>
            </Link>
            <LanguageSwitcher lang={lang} compact onOpen={closeMobileMenu} closeSignal={languageCloseSignal} />
            <details
              ref={mobileMenuRef}
              onToggle={(event) => {
                if ((event.currentTarget as HTMLDetailsElement).open) {
                  setLanguageCloseSignal((prev) => prev + 1);
                }
              }}
              className="relative"
            >
              <summary className="list-none rounded-full border border-zinc-900 px-3 py-1 text-xs font-bold text-zinc-900">
                {labels.menu}
              </summary>
              <div className="absolute right-0 z-50 mt-2 w-[min(90vw,18rem)] rounded-xl border border-zinc-200 bg-white p-2 shadow-lg">
                <nav className="flex flex-col gap-1 text-sm text-zinc-700">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="rounded-lg px-3 py-2 font-semibold transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </details>
          </div>

          <nav className="hidden items-center gap-5 text-sm text-zinc-700 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="font-semibold transition-colors hover:text-zinc-900">
                {item.label}
              </Link>
            ))}
            <Link href={`/${lang}/tips`} className="inline-flex items-center gap-1 font-semibold transition-colors hover:text-zinc-900" aria-label={labels.search}>
              <SearchIcon />
              <span>{labels.search}</span>
            </Link>
            <LanguageSwitcher lang={lang} />
          </nav>
        </div>
      </Container>
    </header>
  );
}
