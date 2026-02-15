import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { detectPreferredLanguage } from "@/lib/i18n";

export default async function KioskCardRejectedRedirectPage() {
  const acceptLanguage = (await headers()).get("accept-language");
  const lang = detectPreferredLanguage(acceptLanguage);
  redirect(`/${lang}/kiosk-card-rejected`);
}
