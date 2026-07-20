import Image from "next/image";

type UnacemLoaderProps = {
  label?: string;
  compact?: boolean;
};

export function UnacemLoader({
  label = "Cargando",
  compact = false,
}: UnacemLoaderProps): React.ReactElement {
  return (
    <div
      className={
        compact
          ? "flex flex-col items-center justify-center gap-3"
          : "flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4"
      }
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative flex items-center justify-center">
        <span
          className="absolute h-20 w-20 animate-ping rounded-full bg-brand/15"
          aria-hidden="true"
        />
        <Image
          src="/brand/unacem-mark.png"
          alt=""
          width={72}
          height={72}
          className={`relative ${compact ? "h-12 w-12" : "h-16 w-16"} animate-pulse`}
          priority
        />
      </div>
      <p className="text-sm font-medium tracking-wide text-ink-muted uppercase">
        {label}…
      </p>
    </div>
  );
}
