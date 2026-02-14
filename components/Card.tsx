import Link from "next/link";
import type { ReactNode } from "react";
import { ResponsiveImage } from "@/components/ResponsiveImage";

type CardProps = {
  href: string;
  title: string;
  description: string;
  footer?: ReactNode;
  image?: {
    src: string;
    alt: string;
  };
};

export function Card({ href, title, description, footer, image }: CardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-3xl border border-black/5 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
    >
      {image ? (
        <ResponsiveImage
          src={image.src}
          alt={image.alt}
          ratio="4 / 3"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="mb-4 rounded-2xl"
          imageClassName="brightness-[0.9] contrast-[1.08] saturate-[1.08] transition duration-500 group-hover:scale-[1.03]"
        />
      ) : null}
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
      {footer ? <div className="mt-5 flex flex-wrap gap-2">{footer}</div> : null}
    </Link>
  );
}
