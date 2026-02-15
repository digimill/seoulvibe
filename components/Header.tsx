import Link from "next/link";
import { LANGS, LANG_LABELS, type Lang } from "@/lib/i18n";
import { copy } from "@/lib/i18n";
import { Container } from "@/components/Container";

type HeaderProps = {
  lang: Lang;
};

export function Header({ lang }: HeaderProps) {
  const t = copy[lang];
  const navItems = [
    { href: `/${lang}/areas`, label: t.nav.areas },
    { href: `/${lang}/themes`, label: t.nav.themes },
    { href: `/${lang}/tips`, label: t.nav.tips },
    { href: `/${lang}/spots`, label: t.nav.spots },
    { href: `/${lang}/korea-101`, label: t.nav.korea101 },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/75 backdrop-blur-xl">
      <Container className="py-2">
        <div className="flex min-h-16 items-center justify-between gap-3">
          <Link href={`/${lang}`} className="shrink-0 leading-tight">
            <span className="block text-sm font-semibold tracking-tight">{t.appName}</span>
            <span className="hidden text-[11px] text-zinc-500 sm:block">{t.tagline}</span>
          </Link>

          <details className="relative md:hidden">
            <summary className="list-none rounded-full border border-zinc-900 px-3 py-1 text-xs font-medium text-zinc-900">
              Menu
            </summary>
            <div className="absolute right-0 z-50 mt-2 w-[min(90vw,18rem)] rounded-xl border border-zinc-200 bg-white p-2 shadow-lg">
              <nav className="flex flex-col gap-1 text-sm text-zinc-700">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-2 border-t border-zinc-100 pt-2">
                {LANGS.filter((item) => item !== lang).map((item) => (
                  <Link
                    key={item}
                    href={`/${item}`}
                    className="block rounded-lg px-3 py-2 text-xs text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                  >
                    {LANG_LABELS[item]}
                  </Link>
                ))}
              </div>
            </div>
          </details>

          <nav className="hidden items-center gap-5 text-sm text-zinc-600 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-zinc-900">
                {item.label}
              </Link>
            ))}
            <div className="group relative">
              <button
                type="button"
                className="rounded-full border border-zinc-900 bg-zinc-900 px-3 py-1 text-xs font-medium tracking-wide text-white"
              >
                {LANG_LABELS[lang]}
              </button>
              <div className="invisible absolute right-0 z-50 mt-2 min-w-44 rounded-lg border border-zinc-200 bg-white p-1 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                {LANGS.filter((item) => item !== lang).map((item) => (
                  <Link
                    key={item}
                    href={`/${item}`}
                    className="block rounded-md px-3 py-2 text-xs text-zinc-700 transition-colors hover:bg-zinc-100"
                  >
                    {LANG_LABELS[item]}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </Container>
    </header>
  );
}
