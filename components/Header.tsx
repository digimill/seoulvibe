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

export function Header({ lang }: HeaderProps) {
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const [languageCloseSignal, setLanguageCloseSignal] = useState(0);
  const t = copy[lang];
  const labels =
    lang === "ko"
      ? { fixes: "문제해결", areas: "지역", tools: "도구", subtitle: "서울 문제 해결 가이드", menu: "메뉴" }
      : lang === "ja"
        ? { fixes: "解決", areas: "エリア", tools: "ツール", subtitle: "ソウル即対応ガイド", menu: "メニュー" }
        : lang === "zh-cn"
          ? { fixes: "解决", areas: "区域", tools: "工具", subtitle: "首尔问题速解", menu: "菜单" }
          : lang === "zh-tw" || lang === "zh-hk"
            ? { fixes: "解決", areas: "地區", tools: "工具", subtitle: "首爾問題速解", menu: "選單" }
            : { fixes: "Fixes", areas: "Areas", tools: "Tools", subtitle: "Seoul problem solver", menu: "Menu" };
  const navItems = [
    { href: `/${lang}/tips`, label: labels.fixes },
    { href: `/${lang}/areas`, label: labels.areas },
    { href: `/${lang}/tools`, label: labels.tools },
  ];

  useEffect(() => {
    if (mobileMenuRef.current) {
      mobileMenuRef.current.open = false;
    }
  }, [pathname]);

  const closeMobileMenu = () => {
    if (mobileMenuRef.current) {
      mobileMenuRef.current.open = false;
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur-xl">
      <Container className="py-2">
        <div className="flex min-h-16 items-center justify-between gap-3">
          <Link href={`/${lang}`} className="min-w-0 leading-tight md:shrink-0">
            <span className="block text-sm font-black tracking-tight">{t.appName}</span>
            <span className="mt-0.5 block max-w-[10rem] truncate text-[10px] font-semibold text-zinc-500 sm:max-w-none sm:text-[11px]">
              {labels.subtitle}
            </span>
          </Link>

          <div className="flex items-center gap-2 md:hidden">
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
            <LanguageSwitcher lang={lang} />
          </nav>
        </div>
      </Container>
    </header>
  );
}
