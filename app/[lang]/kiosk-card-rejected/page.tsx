import { notFound, redirect } from "next/navigation";
import { isLang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

export default async function KioskCardRejectedRedirectPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  redirect(`/${lang}/now/kiosk/card-rejected`);
}
