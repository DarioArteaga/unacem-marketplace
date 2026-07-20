import { redirect } from "next/navigation";
import { CasoEditor } from "@/components/admin/CasoEditor";
import { fetchMe } from "@/lib/api/serverAdmin";

export default async function NuevoCasoPage(): Promise<React.ReactElement> {
  const user = await fetchMe();
  if (!user) redirect("/admin/login");
  if (user.role !== "coach" && user.role !== "super_admin") {
    redirect("/admin");
  }
  return <CasoEditor />;
}
