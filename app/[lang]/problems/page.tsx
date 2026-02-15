import { notFound, redirect } from "next/navigation";
import { isLang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  redirect(`/${lang}/tips#problem-list`);
}
