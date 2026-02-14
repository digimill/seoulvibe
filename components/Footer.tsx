import type { Lang } from "@/lib/i18n";
import { getCopy } from "@/lib/i18n";
import { Container } from "@/components/Container";

type FooterProps = {
  lang: Lang;
};

export function Footer({ lang }: FooterProps) {
  const t = getCopy(lang);

  return (
    <footer className="border-t border-black/5 py-10">
      <Container className="flex items-center justify-between gap-3 text-sm text-zinc-500">
        <p>{t.tagline}</p>
        <p>{t.footer}</p>
      </Container>
    </footer>
  );
}
