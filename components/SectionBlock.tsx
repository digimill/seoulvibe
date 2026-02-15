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
        <div className="mb-6 sm:mb-9">
          <h2 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">{title}</h2>
          {description ? <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-zinc-700 sm:text-base">{description}</p> : null}
        </div>
        {children}
      </Container>
    </section>
  );
}
