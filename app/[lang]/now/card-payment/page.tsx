import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { NowCardPaymentFlow } from "@/components/NowCardPaymentFlow";
import { isLang, type Lang } from "@/lib/i18n";

type PageProps = { params: Promise<{ lang: string }> };

export default async function NowCardPaymentPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const locale = lang as Lang;

  return (
    <Container className="py-10 sm:py-14">
      <NowCardPaymentFlow lang={locale} />
    </Container>
  );
}
