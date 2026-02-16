import { notFound, redirect } from "next/navigation";
import { isLang } from "@/lib/i18n";

type ToolsPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function ToolsPage({ params }: ToolsPageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  redirect(`/${lang}/now`);
}
