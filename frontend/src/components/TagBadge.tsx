type TagBadgeProps = {
  tag: string;
  interactive?: boolean;
};

export function TagBadge({ tag, interactive = false }: TagBadgeProps): React.ReactElement {
  return (
    <span
      className={`rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-brand ${
        interactive
          ? "transition-colors group-hover:bg-brand/10 group-focus-visible:bg-brand/10"
          : ""
      }`}
    >
      {tag}
    </span>
  );
}
