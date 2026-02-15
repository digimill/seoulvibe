import { redirect } from "next/navigation";

export default async function LocalizedOliveYoungNoHyphenRedirectPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  redirect(`/${lang}/olive-young-tourist-guide`);
}
