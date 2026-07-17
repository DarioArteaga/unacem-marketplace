import Image from "next/image";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export function SiteHeader(): React.ReactElement {
  return (
    <header className="border-b border-white/10 bg-ink text-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          <Image
            src="/brand/grupo-unacem-horizontal.png"
            alt="Grupo UNACEM"
            width={168}
            height={48}
            className="h-9 w-auto sm:h-10"
            priority
          />
          <span className="hidden h-8 w-px bg-white/30 sm:block" aria-hidden="true" />
          <span className="truncate font-serif text-lg font-semibold tracking-tight sm:text-xl">
            {SITE_NAME}
          </span>
        </Link>
        <nav aria-label="Principal">
          <Link
            href="/"
            className="text-sm font-medium text-white/90 outline-none transition hover:text-white focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Casos de uso
          </Link>
        </nav>
      </div>
    </header>
  );
}
