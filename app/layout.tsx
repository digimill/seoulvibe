import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Seoul Vibe",
    template: "%s | Seoul Vibe",
  },
  description: "Seoul Vibe - 거의 서울에 관한 모든 것.",
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Seoul Vibe",
    description: "Seoul Vibe - 거의 서울에 관한 모든 것.",
    siteName: "Seoul Vibe",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seoul Vibe",
    description: "Seoul Vibe - 거의 서울에 관한 모든 것.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "4-mpEY74hY7_c448jvSliyDmyIwoVFqDemZgGa74BIc",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <body>
        {children}
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
        <Analytics />
      </body>
    </html>
  );
}
