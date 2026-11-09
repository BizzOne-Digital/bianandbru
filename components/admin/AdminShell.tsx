"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarCheck,
  ExternalLink,
  FileText,
  FolderTree,
  HelpCircle,
  Images,
  LayoutDashboard,
  Layers,
  LogOut,
  Mail,
  Menu,
  MessageSquareQuote,
  Package,
  Percent,
  Settings,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { BearMark } from "@/components/common/Logo";
import { cn } from "@/lib/utils";

const NAV = [
  { group: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
  {
    group: "Store",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/collections", label: "Collections", icon: Layers },
      { href: "/admin/categories", label: "Categories", icon: FolderTree },
      { href: "/admin/offers", label: "Special Offers", icon: Percent },
      { href: "/admin/orders", label: "Order Requests", icon: ShoppingBag },
    ],
  },
  {
    group: "Content",
    items: [
      { href: "/admin/content", label: "Home & Pages", icon: FileText },
      { href: "/admin/team", label: "Team Members", icon: Users },
      { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { href: "/admin/faq", label: "FAQs", icon: HelpCircle },
      { href: "/admin/uploads", label: "Images / Uploads", icon: Images },
    ],
  },
  {
    group: "Customers",
    items: [
      { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
      { href: "/admin/subscribers", label: "Newsletter", icon: Mail },
    ],
  },
  { group: "System", items: [{ href: "/admin/settings", label: "Site Settings", icon: Settings }] },
];

function SidebarNav({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Admin" className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
      {NAV.map((g) => (
        <div key={g.group}>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-white/45">{g.group}</p>
          <ul className="mt-2 space-y-0.5">
            {g.items.map((it) => {
              const active = it.href === "/admin" ? pathname === "/admin" : pathname.startsWith(it.href);
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white",
                      active && "bg-white/15 text-white"
                    )}
                  >
                    <it.icon aria-hidden className={cn("h-4 w-4", active && "text-blush")} />
                    {it.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    toast.success("Logged out.");
    router.replace("/admin/login");
    router.refresh();
  }

  const brand = (
    <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-4">
      <BearMark inverted className="h-9 w-10" />
      <div className="leading-tight">
        <p className="font-serif text-lg font-semibold text-white">BIAN&BRU</p>
        <p className="text-[11px] uppercase tracking-widest text-white/60">Admin</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-navy lg:flex">
        {brand}
        <SidebarNav pathname={pathname} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-navy shadow-xl">
            <div className="flex items-center justify-between pr-3">
              {brand}
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="grid h-10 w-10 place-items-center rounded-lg text-white hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarNav pathname={pathname} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-lg hover:bg-slate-100 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" target="_blank" className="hidden items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-navy sm:inline-flex">
            <ExternalLink aria-hidden className="h-4 w-4" /> View site
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:inline">{email}</span>
            <button type="button" onClick={logout} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-semibold hover:bg-slate-50">
              <LogOut aria-hidden className="h-4 w-4" /> Logout
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

