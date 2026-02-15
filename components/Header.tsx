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
  const navItems = [
    { href: `/${lang}`, label: "Start" },
    { href: `/${lang}/tips/kiosk-survival-flow`, label: "Kiosk" },
    { href: `/${lang}/tips/subway-map-confusion-cuts`, label: "Subway" },
    { href: `/${lang}/tips/oliveyoung-master-playbook`, label: "Olive" },
    { href: `/${lang}/areas`, label: "Areas" },
    { href: `/${lang}/crowded`, label: "Crowd" },
    { href: `/${lang}/tips`, label: "All Fixes" },
    ...(lang === "en" ? [{ href: "/en/problems", label: "Problems" }] : []),
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
              Seoul problem solver
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
                Menu
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
