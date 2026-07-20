import { redirect } from "next/navigation";
import { UsersAdmin } from "@/components/admin/UsersAdmin";
import { fetchMe, fetchUsers } from "@/lib/api/serverAdmin";

export default async function AdminUsersPage(): Promise<React.ReactElement> {
  const user = await fetchMe();
  if (!user) redirect("/admin/login");
  if (user.role !== "super_admin") redirect("/admin");
  const users = await fetchUsers();
  return <UsersAdmin users={users} />;
}
