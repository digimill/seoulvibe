import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { detectPreferredLanguage } from "@/lib/i18n";

export default async function HowMuchTmoneyRedirectPage() {
  const acceptLanguage = (await headers()).get("accept-language");
  const lang = detectPreferredLanguage(acceptLanguage);
  redirect(`/${lang}/how-much-tmoney`);
}
