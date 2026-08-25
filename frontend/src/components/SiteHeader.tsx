"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_NAME } from "@/lib/site";

const NAV = [
  { href: "/", label: "Casos de uso" },
  { href: "/metricas", label: "Métricas de uso" },
  { href: "/aprendizaje", label: "Aprendizaje" },
] as const;

function navActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/" || pathname.startsWith("/casos");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader(): React.ReactElement {
  const pathname = usePathname();

  return (
    <header className="border-b border-white/10 bg-ink text-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          <Image
            src="/brand/grupo-unacem-horizontal.png"
            alt="Grupo UNACEM"
            width={168}
            height={48}
            className="h-8 w-auto sm:h-9"
            priority
          />
          <span className="hidden h-7 w-px bg-white/30 sm:block" aria-hidden="true" />
          <span className="truncate font-serif text-base font-semibold tracking-tight sm:text-lg">
            {SITE_NAME}
          </span>
        </Link>
        <nav aria-label="Principal" className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1">
          {NAV.map((item) => {
            const active = navActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${
                  active ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
