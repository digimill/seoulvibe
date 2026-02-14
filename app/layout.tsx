import type { Metadata } from "next";
import "./globals.css";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Seoul Vibe",
    template: "%s | Seoul Vibe",
  },
  description: "Your local friend in Seoul.",
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Seoul Vibe",
    description: "Your local friend in Seoul.",
    siteName: "Seoul Vibe",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seoul Vibe",
    description: "Your local friend in Seoul.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
