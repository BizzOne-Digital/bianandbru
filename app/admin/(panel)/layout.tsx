import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminSession } from "@/lib/auth";

export const metadata: Metadata = { title: { default: "Admin", template: "%s | BIAN&BRU Admin" }, robots: { index: false, follow: false } };

/** Server-side gate for every admin page. Admin APIs check the session independently. */
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return <AdminShell email={session.email}>{children}</AdminShell>;
}
