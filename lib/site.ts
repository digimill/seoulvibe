const DEFAULT_SITE_URL = "https://seoulvibe.vercel.app";

export function getSiteUrl(): string {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
  return rawUrl.replace(/\/+$/, "");
}

