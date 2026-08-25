import Image from "next/image";
import { SITE_NAME } from "@/lib/site";

export function SiteFooter(): React.ReactElement {
  return (
    <footer className="mt-auto border-t border-ink-muted/10 bg-ink text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-2">
          <p className="font-serif text-lg font-semibold text-white">{SITE_NAME}</p>
          <p className="text-sm text-white/70">Casos de uso de IA · Grupo UNACEM</p>
        </div>
        <Image
          src="/brand/grupo-unacem-horizontal.png"
          alt="Grupo UNACEM"
          width={160}
          height={46}
          className="h-9 w-auto opacity-95"
        />
      </div>
    </footer>
  );
}
