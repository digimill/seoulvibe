import Image from "next/image";

type ResponsiveImageProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  ratio?: `${number} / ${number}`;
  className?: string;
  imageClassName?: string;
};

export function ResponsiveImage({
  src,
  alt,
  sizes,
  priority = false,
  ratio = "4 / 3",
  className = "",
  imageClassName = "",
}: ResponsiveImageProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`.trim()}
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={88}
        sizes={sizes}
        className={`object-cover ${imageClassName}`.trim()}
      />
    </div>
  );
}
