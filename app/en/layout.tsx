import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header lang="en" />
      <main>{children}</main>
      <Footer lang="en" />
    </div>
  );
}
