import { formatTagLabel, isStatusTag } from "@/lib/tags";

type TagBadgeProps = {
  tag: string;
  interactive?: boolean;
};

export function TagBadge({ tag, interactive = false }: TagBadgeProps): React.ReactElement {
  const label = formatTagLabel(tag);
  const status = isStatusTag(tag);

  const className = status
    ? `rounded-full bg-brand px-2.5 py-1 text-xs font-medium text-white ${
        interactive ? "transition group-hover:bg-brand-accent group-focus-visible:bg-brand-accent" : ""
      }`
    : `rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-brand ${
        interactive
          ? "transition-colors group-hover:bg-brand/10 group-focus-visible:bg-brand/10"
          : ""
      }`;

  return <span className={className}>{label}</span>;
}
