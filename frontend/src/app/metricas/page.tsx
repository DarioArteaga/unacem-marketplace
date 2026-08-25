import { MetricasUsoDashboard } from "@/components/MetricasUsoDashboard";
import { fetchCasosPublic } from "@/lib/api/public";
import type { CasoPublic } from "@/lib/api/types";

async function loadCasos(): Promise<CasoPublic[]> {
  try {
    const page = await fetchCasosPublic({ page_size: 100 });
    return page.items;
  } catch {
    return [];
  }
}

export default async function MetricasPage(): Promise<React.ReactElement> {
  const casos = await loadCasos();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <MetricasUsoDashboard casos={casos} />
    </div>
  );
}
