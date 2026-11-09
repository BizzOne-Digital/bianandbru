import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { BearMark } from "@/components/common/Logo";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Admin Login", robots: { index: false, follow: false } };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ expired?: string }> }) {
  if (await getAdminSession()) redirect("/admin");
  const { expired } = await searchParams;
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-baby via-white to-blush-soft p-4 font-sans">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <BearMark className="mx-auto h-14 w-16" />
        <h1 className="mt-4 text-center font-sans text-xl font-bold text-slate-900">BIAN&BRU Admin</h1>
        <p className="mt-1 text-center text-sm text-slate-500">Sign in to manage your store</p>
        {expired && <p className="mt-4 rounded-lg bg-amber-50 p-3 text-center text-sm text-amber-800">Session expired. Please sign in again.</p>}
        <LoginForm />
      </div>
    </main>
  );
}
