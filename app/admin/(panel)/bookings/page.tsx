"use client";

import { useCallback, useEffect, useState } from "react";
import { Mail, Phone, PhoneCall, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api, Badge, Button, Card, ConfirmationDialog, inputCls, PageHeader, TableSkeleton } from "@/components/admin/ui";

type Booking = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  reason: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: "New" | "Contacted" | "Completed" | "Cancelled";
  notes: string;
  createdAt: string;
};

const STATUSES = ["New", "Contacted", "Completed", "Cancelled"] as const;
const TONE = { New: "pink", Contacted: "blue", Completed: "green", Cancelled: "slate" } as const;

export default function BookingsAdmin() {
  const [rows, setRows] = useState<Booking[] | null>(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [toDelete, setToDelete] = useState<Booking | null>(null);
  const [busy, setBusy] = useState("");

  const load = useCallback(async () => {
    try {
      const d = await api<{ items: Booking[] }>(`/api/admin/bookings?limit=100${status ? `&status=${status}` : ""}`);
      setRows(d.items);
      setNotes(Object.fromEntries(d.items.map((b) => [b._id, b.notes || ""])));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load bookings");
      setRows([]);
    }
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  async function patch(b: Booking, body: Partial<Booking>, msg: string) {
    setBusy(b._id);
    try {
      await api(`/api/admin/bookings/${b._id}`, { method: "PATCH", body: JSON.stringify(body) });
      setRows((rs) => rs?.map((x) => (x._id === b._id ? { ...x, ...body } : x)) ?? null);
      toast.success(msg);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update");
    } finally {
      setBusy("");
    }
  }

  async function remove() {
    if (!toDelete) return;
    setBusy(toDelete._id);
    try {
      await api(`/api/admin/bookings/${toDelete._id}`, { method: "DELETE" });
      toast.success("Booking deleted.");
      setToDelete(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete");
    } finally {
      setBusy("");
    }
  }

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Requests submitted from the Booking page."
        actions={
          <>
            <label htmlFor="status-filter" className="sr-only">
              Filter by status
            </label>
            <select id="status-filter" className={inputCls} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </>
        }
      />
      {rows === null ? (
        <Card>
          <TableSkeleton />
        </Card>
      ) : rows.length === 0 ? (
        <Card className="p-10 text-center text-sm text-slate-500">No bookings yet.</Card>
      ) : (
        <ul className="space-y-4">
          {rows.map((b) => (
            <li key={b._id}>
              <Card className="p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-sans text-base font-semibold text-slate-900">{b.name}</h2>
                      <Badge tone={TONE[b.status]}>{b.status}</Badge>
                      <span className="text-xs text-slate-400">{new Date(b.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                      <a href={`mailto:${b.email}`} className="inline-flex items-center gap-1 hover:text-navy">
                        <Mail aria-hidden className="h-3.5 w-3.5" /> {b.email}
                      </a>
                      {b.phone && (
                        <a href={`tel:${b.phone}`} className="inline-flex items-center gap-1 hover:text-navy">
                          <Phone aria-hidden className="h-3.5 w-3.5" /> {b.phone}
                        </a>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-slate-700">
                      <strong>{b.reason || "General"}</strong>
                      {(b.preferredDate || b.preferredTime) && ` · Preferred: ${b.preferredDate} ${b.preferredTime}`}
                    </p>
                    {b.message && <p className="mt-2 whitespace-pre-line rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{b.message}</p>}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <label htmlFor={`st-${b._id}`} className="sr-only">
                      Status
                    </label>
                    <select id={`st-${b._id}`} className={`${inputCls} w-36`} value={b.status} onChange={(e) => patch(b, { status: e.target.value as Booking["status"] }, "Status updated.")}>
                      {STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    {b.status === "New" && (
                      <Button size="sm" variant="secondary" onClick={() => patch(b, { status: "Contacted" }, "Marked as contacted.")} loading={busy === b._id}>
                        <PhoneCall className="h-4 w-4" /> Mark contacted
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" aria-label={`Delete booking from ${b.name}`} onClick={() => setToDelete(b)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <label htmlFor={`notes-${b._id}`} className="sr-only">
                    Internal notes
                  </label>
                  <textarea
                    id={`notes-${b._id}`}
                    rows={2}
                    className={inputCls}
                    placeholder="Internal notes (not visible to the customer)"
                    value={notes[b._id] ?? ""}
                    onChange={(e) => setNotes((n) => ({ ...n, [b._id]: e.target.value }))}
                  />
                  <Button size="sm" variant="secondary" className="self-start" disabled={(notes[b._id] ?? "") === (b.notes || "")} onClick={() => patch(b, { notes: notes[b._id] }, "Notes saved.")}>
                    Save notes
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
      <ConfirmationDialog
        open={!!toDelete}
        title="Delete booking?"
        message={`The request from ${toDelete?.name} will be permanently deleted.`}
        loading={!!busy}
        onConfirm={remove}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
