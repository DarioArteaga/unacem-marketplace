import { redirect } from "next/navigation";
import { CasoEditor } from "@/components/admin/CasoEditor";
import { fetchAdminCaso, fetchMe } from "@/lib/api/serverAdmin";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditarCasoPage({ params }: PageProps): Promise<React.ReactElement> {
  const user = await fetchMe();
  if (!user) redirect("/admin/login");
  if (user.role !== "coach" && user.role !== "super_admin") {
    redirect("/admin");
  }
  const { id } = await params;
  const caso = await fetchAdminCaso(id);
  return <CasoEditor initial={caso} />;
}
