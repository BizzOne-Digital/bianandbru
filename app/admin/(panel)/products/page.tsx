"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api, Badge, Button, Card, ConfirmationDialog, inputCls, PageHeader, Switch, TableSkeleton } from "@/components/admin/ui";
import { formatPrice, getSafeImageUrl, PLACEHOLDER_PRODUCT } from "@/lib/utils";

type P = {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  discountPercent: number;
  stock: number;
  trackInventory: boolean;
  published: boolean;
  featured: boolean;
  status: string;
  thumbnail: string;
  images: string[];
  category: { name: string } | null;
  collectionRef: { name: string } | null;
};

export default function ProductsAdmin() {
  const [rows, setRows] = useState<P[] | null>(null);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [toDelete, setToDelete] = useState<P | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const d = await api<{ items: P[]; pages: number; total: number }>(`/api/admin/products?q=${encodeURIComponent(q)}&page=${page}`);
      setRows(d.items);
      setPages(d.pages);
      setTotal(d.total);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load products");
      setRows([]);
    }
  }, [q, page]);

  useEffect(() => {
    const t = setTimeout(load, q ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, q]);

  async function toggle(p: P, key: "published" | "featured") {
    const next = !p[key];
    setRows((rs) => rs?.map((x) => (x._id === p._id ? { ...x, [key]: next } : x)) ?? null);
    try {
      await api(`/api/admin/products/${p._id}`, { method: "PATCH", body: JSON.stringify({ [key]: next }) });
      toast.success("Changes saved successfully.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update");
      load();
    }
  }

  async function remove() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api(`/api/admin/products/${toDelete._id}`, { method: "DELETE" });
      toast.success("Product deleted.");
      setToDelete(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Products"
        description={`${total} products`}
        actions={
          <Link href="/admin/products/new" className="inline-flex h-10 items-center gap-2 rounded-lg bg-navy px-4 text-sm font-semibold text-white hover:bg-navy-deep">
            <Plus className="h-4 w-4" /> New product
          </Link>
        }
      />
      <Card>
        <div className="border-b border-slate-200 p-3">
          <div className="relative max-w-sm">
            <Search aria-hidden className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <label htmlFor="p-search" className="sr-only">
              Search products
            </label>
            <input
              id="p-search"
              className={`${inputCls} pl-9`}
              placeholder="Search by name, SKU or slug..."
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
        {rows === null ? (
          <TableSkeleton />
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No products found.{" "}
            <Link href="/admin/products/new" className="font-semibold text-navy underline">
              Create your first product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="hidden px-4 py-3 lg:table-cell">Collection / Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Stock</th>
                  <th className="hidden px-4 py-3 md:table-cell">Featured</th>
                  <th className="px-4 py-3">Published</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <Link href={`/admin/products/${p._id}`} className="flex items-center gap-3">
                        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          <Image src={getSafeImageUrl(p.thumbnail || p.images[0], PLACEHOLDER_PRODUCT)} alt="" fill sizes="44px" className="object-cover" />
                        </span>
                        <span>
                          <span className="block font-medium text-slate-900 hover:text-navy">{p.name}</span>
                          <span className="text-xs text-slate-400">{p.sku || p.slug}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="hidden px-4 py-3 text-slate-600 lg:table-cell">
                      {p.collectionRef?.name || "—"} / {p.category?.name || "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="font-semibold">{formatPrice(p.price)}</span>
                      {p.discountPercent > 0 && (
                        <span className="ml-2">
                          <Badge tone="pink">-{p.discountPercent}%</Badge>
                        </span>
                      )}
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      {!p.trackInventory ? <Badge>Not tracked</Badge> : p.stock <= 0 ? <Badge tone="red">Out</Badge> : p.stock <= 5 ? <Badge tone="amber">{p.stock} low</Badge> : p.stock}
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <Switch checked={p.featured} onChange={() => toggle(p, "featured")} label={`Featured: ${p.name}`} />
                    </td>
                    <td className="px-4 py-3">
                      <Switch checked={p.published} onChange={() => toggle(p, "published")} label={`Published: ${p.name}`} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <Link href={`/admin/products/${p._id}`} aria-label={`Edit ${p.name}`} className="inline-grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <Button size="sm" variant="ghost" aria-label={`Delete ${p.name}`} onClick={() => setToDelete(p)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pages > 1 && (
          <div className="flex items-center justify-end gap-2 border-t border-slate-200 p-3 text-sm">
            <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} aria-label="Previous page">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>
              Page {page} of {pages}
            </span>
            <Button size="sm" variant="secondary" disabled={page >= pages} onClick={() => setPage((p) => p + 1)} aria-label="Next page">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </Card>
      <ConfirmationDialog
        open={!!toDelete}
        title="Delete product?"
        message={`“${toDelete?.name}” and its uploaded images will be permanently deleted.`}
        loading={deleting}
        onConfirm={remove}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
