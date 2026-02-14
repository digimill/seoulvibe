import Link from "next/link";
import { LANGS, LANG_LABELS, type Lang } from "@/lib/i18n";
import { copy } from "@/lib/i18n";
import { Container } from "@/components/Container";

type HeaderProps = {
  lang: Lang;
};

export function Header({ lang }: HeaderProps) {
  const t = copy[lang];

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/75 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between">
        <Link href={`/${lang}`} className="text-sm font-semibold tracking-tight">
          {t.appName}
        </Link>
        <nav className="flex items-center gap-5 text-sm text-zinc-600">
          <Link href={`/${lang}/areas`} className="transition-colors hover:text-zinc-900">
            {t.nav.areas}
          </Link>
          <Link href={`/${lang}/themes`} className="transition-colors hover:text-zinc-900">
            {t.nav.themes}
          </Link>
          <Link href={`/${lang}/tips`} className="transition-colors hover:text-zinc-900">
            {t.nav.tips}
          </Link>
          <Link href={`/${lang}/korea-101`} className="transition-colors hover:text-zinc-900">
            {t.nav.korea101}
          </Link>
          <div className="group relative hidden md:block">
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
      </Container>
    </header>
  );
}
