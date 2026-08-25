import { redirect } from "next/navigation";
import { fetchMe } from "@/lib/api/serverAdmin";

export default async function Modulo9Page(): Promise<React.ReactElement> {
  const user = await fetchMe();
  if (!user) {
    redirect("/admin/login?next=/aprendizaje/modulo-9");
  }

  return (
    <iframe
      src="/aprendizaje/modulo-9.html"
      title="Módulo 9 · Pedagogía para entornos digitales"
      className="h-screen w-screen border-0"
    />
  );
}
