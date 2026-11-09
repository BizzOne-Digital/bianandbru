"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { api, Badge, Card, inputCls, Modal, PageHeader, TableSkeleton } from "@/components/admin/ui";
import { formatPrice } from "@/lib/utils";

type Order = {
  _id: string;
  orderNumber: string;
  items: { name: string; price: number; quantity: number }[];
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  customer: Record<string, string>;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

export default function OrdersAdmin() {
  const [rows, setRows] = useState<Order[] | null>(null);
  const [open, setOpen] = useState<Order | null>(null);

  const load = useCallback(async () => {
    try {
      setRows((await api<{ items: Order[] }>("/api/admin/orders?limit=100")).items);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load orders");
      setRows([]);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  async function patch(o: Order, body: Partial<Order>) {
    try {
      await api(`/api/admin/orders/${o._id}`, { method: "PATCH", body: JSON.stringify(body) });
      setRows((rs) => rs?.map((x) => (x._id === o._id ? { ...x, ...body } : x)) ?? null);
      setOpen((cur) => (cur && cur._id === o._id ? { ...cur, ...body } : cur));
      toast.success("Order updated.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update");
    }
  }

  return (
    <>
      <PageHeader title="Order Requests" description="Orders submitted from checkout. Payment is not collected online yet — mark as paid only after you receive payment." />
      <Card>
        {rows === null ? (
          <TableSkeleton />
        ) : rows.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500">No order requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="hidden px-4 py-3 md:table-cell">Date</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => setOpen(o)} className="font-semibold text-navy underline-offset-2 hover:underline">
                        {o.orderNumber}
                      </button>
                    </td>
                    <td className="px-4 py-3">{o.customer?.name}</td>
                    <td className="hidden px-4 py-3 md:table-cell">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-semibold">{formatPrice(o.total, o.currency)}</td>
                    <td className="px-4 py-3">
                      <Badge tone={o.status === "fulfilled" ? "green" : o.status === "cancelled" ? "slate" : o.status === "processing" ? "blue" : "amber"}>{o.status}</Badge>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <Badge tone={o.paymentStatus === "paid" ? "green" : o.paymentStatus === "refunded" ? "slate" : "red"}>{o.paymentStatus}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={!!open} onClose={() => setOpen(null)} title={`Order ${open?.orderNumber ?? ""}`}>
        {open && (
          <div className="space-y-5 text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="o-status" className="mb-1 block font-medium">
                  Order status
                </label>
                <select id="o-status" className={inputCls} value={open.status} onChange={(e) => patch(open, { status: e.target.value })}>
                  {["pending", "processing", "fulfilled", "cancelled"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="o-pay" className="mb-1 block font-medium">
                  Payment status
                </label>
                <select id="o-pay" className={inputCls} value={open.paymentStatus} onChange={(e) => patch(open, { paymentStatus: e.target.value })}>
                  {["unpaid", "paid", "refunded"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="font-semibold">{open.customer?.name}</p>
              <p>
                {open.customer?.email} · {open.customer?.phone}
              </p>
              <p>
                {open.customer?.address}, {open.customer?.city} {open.customer?.state} {open.customer?.zip}
              </p>
              {open.customer?.notes && <p className="mt-2 italic">“{open.customer.notes}”</p>}
            </div>
            <ul className="divide-y divide-slate-100">
              {open.items.map((i, idx) => (
                <li key={idx} className="flex justify-between py-2">
                  <span>
                    {i.name} × {i.quantity}
                  </span>
                  <span>{formatPrice(i.price * i.quantity, open.currency)}</span>
                </li>
              ))}
            </ul>
            <p className="flex justify-between border-t pt-3 font-bold">
              <span>Total</span>
              <span>{formatPrice(open.total, open.currency)}</span>
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
