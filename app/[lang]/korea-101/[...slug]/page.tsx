import { notFound, redirect } from "next/navigation";
import { isLang } from "@/lib/i18n";

type Korea101RedirectPageProps = {
  params: Promise<{ lang: string; slug: string[] }>;
};

export default async function Korea101RedirectPage({ params }: Korea101RedirectPageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  redirect(`/${lang}/korea-101`);
}
