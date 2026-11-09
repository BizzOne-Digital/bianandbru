"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api, Button, Card, PageHeader, TableSkeleton } from "@/components/admin/ui";

type Sub = { _id: string; email: string; createdAt: string };

export default function SubscribersAdmin() {
  const [rows, setRows] = useState<Sub[] | null>(null);
  const load = useCallback(async () => {
    try {
      setRows((await api<{ items: Sub[] }>("/api/admin/subscribers?limit=100")).items);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load");
      setRows([]);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  function exportCsv() {
    const csv = "email,subscribed\n" + (rows || []).map((r) => `${r.email},${r.createdAt}`).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "subscribers.csv";
    a.click();
  }

  async function remove(s: Sub) {
    try {
      await api(`/api/admin/subscribers/${s._id}`, { method: "DELETE" });
      toast.success("Subscriber removed.");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete");
    }
  }

  return (
    <>
      <PageHeader
        title="Newsletter Subscribers"
        description="Emails collected from the footer form."
        actions={
          <Button variant="secondary" onClick={exportCsv} disabled={!rows?.length}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        }
      />
      <Card>
        {rows === null ? (
          <TableSkeleton />
        ) : rows.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500">No subscribers yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {rows.map((s) => (
              <li key={s._id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span>{s.email}</span>
                <span className="flex items-center gap-3 text-slate-400">
                  {new Date(s.createdAt).toLocaleDateString()}
                  <Button size="sm" variant="ghost" aria-label={`Remove ${s.email}`} onClick={() => remove(s)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
