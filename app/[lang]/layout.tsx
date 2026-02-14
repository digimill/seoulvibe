import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LANGS, isLang, type Lang } from "@/lib/i18n";

type LangLayoutProps = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: LangLayoutProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};

  const languageAlternates = Object.fromEntries(LANGS.map((locale) => [locale, `/${locale}`]));

  return {
    alternates: {
      canonical: `/${lang}`,
      languages: {
        ...languageAlternates,
        "x-default": "/en",
      },
    },
  };
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;

  if (!isLang(lang)) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Header lang={lang as Lang} />
      <main>{children}</main>
      <Footer lang={lang as Lang} />
    </div>
  );
}
