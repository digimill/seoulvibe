import type { ReactNode } from "react";
import { Container } from "@/components/Container";

type SectionBlockProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function SectionBlock({ title, description, children }: SectionBlockProps) {
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
          {description ? <p className="mt-2 max-w-2xl text-sm text-zinc-600 sm:text-base">{description}</p> : null}
        </div>
        {children}
      </Container>
    </section>
  );
}
