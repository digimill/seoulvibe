type TagBadgeProps = {
  children: string;
};

export function TagBadge({ children }: TagBadgeProps) {
  return (
    <span className="inline-flex whitespace-nowrap rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600">
      {children}
    </span>
  );
}
