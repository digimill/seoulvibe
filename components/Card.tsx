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
      className="group flex h-full flex-col rounded-3xl border-2 border-zinc-900 bg-white p-5 shadow-[0_8px_0_0_rgba(24,24,27,0.95)] transition duration-300 hover:-translate-y-0.5 hover:bg-zinc-50"
    >
      {image ? (
        <ResponsiveImage
          src={image.src}
          alt={image.alt}
          ratio="4 / 3"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="mb-4 rounded-2xl"
          imageClassName="brightness-[0.95] contrast-[1.05] saturate-[1.05] transition duration-500 group-hover:scale-[1.03]"
        />
      ) : null}
      <h3 className="text-xl font-black tracking-tight text-zinc-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-700">{description}</p>
      {footer ? <div className="mt-5 flex flex-wrap gap-2">{footer}</div> : null}
    </Link>
  );
}
