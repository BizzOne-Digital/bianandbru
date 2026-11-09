"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, ImagePlus, Loader2, RefreshCw, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn, discountPercent, getSafeImageUrl, PLACEHOLDER_PRODUCT, slugify } from "@/lib/utils";
import { discardUnsavedUpload, uploadImage } from "./AdminImageField";
import { api, Button, Card, inputCls, Switch } from "./ui";

export type ProductFormValues = {
  _id?: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number | string;
  compareAtPrice: number | string | null;
  currency: string;
  sku: string;
  stock: number | string;
  trackInventory: boolean;
  status: "active" | "draft" | "archived";
  category: string | null;
  collectionRef: string | null;
  keywords: string[];
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  published: boolean;
  images: string[];
  thumbnail: string;
  seoTitle: string;
  seoDescription: string;
};

export const EMPTY_PRODUCT: ProductFormValues = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  price: "",
  compareAtPrice: "",
  currency: "USD",
  sku: "",
  stock: 0,
  trackInventory: true,
  status: "active",
  category: "",
  collectionRef: "",
  keywords: [],
  featured: false,
  bestSeller: false,
  newArrival: false,
  published: true,
  images: [],
  thumbnail: "",
  seoTitle: "",
  seoDescription: "",
};

type Opt = { _id: string; name: string };

/** Multiple images: upload, replace, remove, reorder, choose main (thumbnail). Stores URLs only. */
function ProductImages({ images, thumbnail, onChange }: { images: string[]; thumbnail: string; onChange: (images: string[], thumbnail: string) => void }) {
  const addRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const replaceIdx = useRef(-1);
  const uploadedHere = useRef(new Set<string>());
  const [busy, setBusy] = useState<number | "add" | null>(null);

  async function add(files: FileList | null) {
    if (!files?.length) return;
    setBusy("add");
    const next = [...images];
    for (const f of Array.from(files).slice(0, 12 - images.length)) {
      try {
        const url = await uploadImage(f, "products");
        uploadedHere.current.add(url);
        next.push(url);
        toast.success("Image uploaded successfully.");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Upload failed.");
      }
    }
    onChange(next, thumbnail && next.includes(thumbnail) ? thumbnail : next[0] || "");
    setBusy(null);
    if (addRef.current) addRef.current.value = "";
  }

  async function replace(file?: File) {
    const i = replaceIdx.current;
    if (!file || i < 0) return;
    setBusy(i);
    try {
      const url = await uploadImage(file, "products");
      const old = images[i];
      if (uploadedHere.current.has(old)) discardUnsavedUpload(old);
      uploadedHere.current.add(url);
      const next = images.map((u, j) => (j === i ? url : u));
      onChange(next, thumbnail === old ? url : thumbnail);
      toast.success("Image replaced. Save to apply.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(null);
      if (replaceRef.current) replaceRef.current.value = "";
    }
  }

  function remove(i: number) {
    const old = images[i];
    if (uploadedHere.current.has(old)) discardUnsavedUpload(old);
    const next = images.filter((_, j) => j !== i);
    onChange(next, thumbnail === old ? next[0] || "" : thumbnail);
    toast("Image removed. Save to apply.");
  }

  function move(i: number, d: number) {
    const next = [...images];
    const [it] = next.splice(i, 1);
    next.splice(i + d, 0, it);
    onChange(next, thumbnail);
  }

  return (
    <div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((url, i) => (
          <li key={url} className={cn("overflow-hidden rounded-lg border-2 bg-white", url === thumbnail ? "border-navy" : "border-slate-200")}>
            <div className="relative aspect-square bg-slate-100">
              <Image src={getSafeImageUrl(url, PLACEHOLDER_PRODUCT)} alt={`Product image ${i + 1}`} fill sizes="200px" className="object-cover" />
              {url === thumbnail && <span className="absolute left-1.5 top-1.5 rounded bg-navy px-2 py-0.5 text-[11px] font-semibold text-white">Main</span>}
              {uploadedHere.current.has(url) && <span className="absolute right-1.5 top-1.5 rounded bg-amber-400 px-1.5 py-0.5 text-[10px] font-semibold">New</span>}
              {busy === i && (
                <span className="absolute inset-0 grid place-items-center bg-white/70">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </span>
              )}
            </div>
            <div className="flex flex-wrap justify-between gap-0.5 p-1">
              <button type="button" title="Set as main image" aria-label="Set as main image" onClick={() => onChange(images, url)} className="grid h-8 w-8 place-items-center rounded hover:bg-slate-100">
                <Star className={cn("h-4 w-4", url === thumbnail && "fill-amber-400 text-amber-400")} />
              </button>
              <button type="button" aria-label="Move left" disabled={i === 0} onClick={() => move(i, -1)} className="grid h-8 w-8 place-items-center rounded hover:bg-slate-100 disabled:opacity-30">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button type="button" aria-label="Move right" disabled={i === images.length - 1} onClick={() => move(i, 1)} className="grid h-8 w-8 place-items-center rounded hover:bg-slate-100 disabled:opacity-30">
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Replace image"
                onClick={() => {
                  replaceIdx.current = i;
                  replaceRef.current?.click();
                }}
                className="grid h-8 w-8 place-items-center rounded hover:bg-slate-100"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button type="button" aria-label="Remove image" onClick={() => remove(i)} className="grid h-8 w-8 place-items-center rounded text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
        {images.length < 12 && (
          <li>
            <button
              type="button"
              onClick={() => addRef.current?.click()}
              disabled={busy !== null}
              className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:bg-slate-100"
            >
              {busy === "add" ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-7 w-7" />}
              <span className="text-sm font-medium">{busy === "add" ? "Uploading..." : "Add images"}</span>
              <span className="text-[11px]">JPG, PNG, WEBP, GIF · 8MB</span>
            </button>
          </li>
        )}
      </ul>
      <input ref={addRef} type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" aria-label="Add product images" onChange={(e) => add(e.target.files)} />
      <input ref={replaceRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" aria-label="Replace product image" onChange={(e) => replace(e.target.files?.[0])} />
    </div>
  );
}

export function ProductForm({ initial }: { initial: ProductFormValues }) {
  const router = useRouter();
  const [v, setV] = useState<ProductFormValues>(initial);
  const [slugTouched, setSlugTouched] = useState(!!initial._id);
  const [cats, setCats] = useState<Opt[]>([]);
  const [cols, setCols] = useState<Opt[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ items: Opt[] }>("/api/admin/categories?limit=100").then((d) => setCats(d.items)).catch(() => {});
    api<{ items: Opt[] }>("/api/admin/collections?limit=100").then((d) => setCols(d.items)).catch(() => {});
  }, []);

  const set = <K extends keyof ProductFormValues>(k: K, val: ProductFormValues[K]) => setV((p) => ({ ...p, [k]: val }));
  const off = discountPercent(Number(v.price) || 0, Number(v.compareAtPrice) || 0);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!v.name.trim()) return setError("Name is required");
    if (v.price === "" || Number(v.price) < 0) return setError("Enter a valid price");
    setSaving(true);
    const body = {
      ...v,
      slug: slugify(v.slug || v.name),
      price: Number(v.price),
      compareAtPrice: v.compareAtPrice === "" || v.compareAtPrice == null ? null : Number(v.compareAtPrice),
      stock: Number(v.stock) || 0,
      category: v.category || null,
      collectionRef: v.collectionRef || null,
    };
    delete (body as Partial<ProductFormValues>)._id;
    try {
      if (v._id) {
        await api(`/api/admin/products/${v._id}`, { method: "PUT", body: JSON.stringify(body) });
        toast.success("Changes saved successfully.");
        router.refresh();
      } else {
        const d = await api<{ item: { _id: string } }>("/api/admin/products", { method: "POST", body: JSON.stringify(body) });
        toast.success("Product created successfully.");
        router.replace(`/admin/products/${d.item._id}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not save";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  const L = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700">
      {children}
    </label>
  );

  const toggles: [keyof ProductFormValues, string][] = [
    ["published", "Published"],
    ["featured", "Featured (homepage)"],
    ["bestSeller", "Best seller"],
    ["newArrival", "New arrival"],
    ["trackInventory", "Track inventory"],
  ];

  return (
    <form onSubmit={onSubmit} className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <Card className="space-y-4 p-5">
          <h2 className="font-sans text-base font-semibold">Details</h2>
          <div>
            <L htmlFor="p-name">Name *</L>
            <input
              id="p-name"
              className={inputCls}
              value={v.name}
              required
              onChange={(e) => {
                set("name", e.target.value);
                if (!slugTouched) set("slug", slugify(e.target.value));
              }}
            />
          </div>
          <div>
            <L htmlFor="p-slug">Slug (URL)</L>
            <input
              id="p-slug"
              className={inputCls}
              value={v.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", e.target.value);
              }}
            />
            <p className="mt-1 text-xs text-slate-500">/shop/{slugify(v.slug || v.name) || "..."}</p>
          </div>
          <div>
            <L htmlFor="p-short">Short description</L>
            <textarea id="p-short" rows={2} className={inputCls} value={v.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} />
          </div>
          <div>
            <L htmlFor="p-desc">Description</L>
            <textarea id="p-desc" rows={7} className={inputCls} value={v.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div>
            <L htmlFor="p-keywords">Search keywords (comma separated)</L>
            <input
              id="p-keywords"
              className={inputCls}
              value={v.keywords.join(", ")}
              onChange={(e) =>
                set(
                  "keywords",
                  e.target.value.split(",").map((s) => s.trimStart()).filter((s, i, a) => s || i === a.length - 1)
                )
              }
              onBlur={() => set("keywords", v.keywords.map((s) => s.trim()).filter(Boolean))}
            />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-sans text-base font-semibold">Images</h2>
          <p className="mb-4 mt-1 text-sm text-slate-500">The starred image is the main thumbnail. Use the arrows to reorder the gallery.</p>
          <ProductImages images={v.images} thumbnail={v.thumbnail} onChange={(images, thumbnail) => setV((p) => ({ ...p, images, thumbnail }))} />
        </Card>

        <Card className="grid gap-4 p-5 sm:grid-cols-3">
          <h2 className="font-sans text-base font-semibold sm:col-span-3">Pricing & inventory</h2>
          <div>
            <L htmlFor="p-price">Price (USD) *</L>
            <input id="p-price" type="number" step="0.01" min="0" className={inputCls} value={v.price} onChange={(e) => set("price", e.target.value)} required />
          </div>
          <div>
            <L htmlFor="p-compare">Compare-at price</L>
            <input id="p-compare" type="number" step="0.01" min="0" className={inputCls} value={v.compareAtPrice ?? ""} onChange={(e) => set("compareAtPrice", e.target.value)} />
            <p className="mt-1 text-xs text-slate-500">{off > 0 ? `Shows -${off}% discount` : "Higher than price to show a discount"}</p>
          </div>
          <div>
            <L htmlFor="p-sku">SKU</L>
            <input id="p-sku" className={inputCls} value={v.sku} onChange={(e) => set("sku", e.target.value)} />
          </div>
          <div>
            <L htmlFor="p-stock">Stock</L>
            <input id="p-stock" type="number" min="0" className={inputCls} value={v.stock} onChange={(e) => set("stock", e.target.value)} disabled={!v.trackInventory} />
          </div>
          <div>
            <L htmlFor="p-status">Product status</L>
            <select id="p-status" className={inputCls} value={v.status} onChange={(e) => set("status", e.target.value as ProductFormValues["status"])}>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </Card>

        <Card className="space-y-4 p-5">
          <h2 className="font-sans text-base font-semibold">SEO</h2>
          <div>
            <L htmlFor="p-seot">SEO title</L>
            <input id="p-seot" className={inputCls} value={v.seoTitle} maxLength={160} onChange={(e) => set("seoTitle", e.target.value)} placeholder={v.name} />
          </div>
          <div>
            <L htmlFor="p-seod">SEO description</L>
            <textarea id="p-seod" rows={3} maxLength={320} className={inputCls} value={v.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} placeholder={v.shortDescription} />
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="space-y-3 p-5 xl:sticky xl:top-20">
          {toggles.map(([k, label]) => (
            <div key={k} className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700" id={`lbl-${k}`}>
                {label}
              </span>
              <Switch checked={!!v[k]} onChange={(b) => set(k, b as never)} label={label} />
            </div>
          ))}
          <div className="border-t border-slate-200 pt-3">
            <L htmlFor="p-col">Collection</L>
            <select id="p-col" className={inputCls} value={v.collectionRef || ""} onChange={(e) => set("collectionRef", e.target.value)}>
              <option value="">— None —</option>
              {cols.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <L htmlFor="p-cat">Category</L>
            <select id="p-cat" className={inputCls} value={v.category || ""} onChange={(e) => set("category", e.target.value)}>
              <option value="">— None —</option>
              {cats.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <Button type="submit" loading={saving} className="w-full">
            {v._id ? "Save changes" : "Create product"}
          </Button>
          {v._id && (
            <Link href={`/shop/${v.slug}`} target="_blank" className="flex items-center justify-center gap-1.5 text-sm font-medium text-slate-600 hover:text-navy">
              <ExternalLink aria-hidden className="h-4 w-4" /> View on site
            </Link>
          )}
        </Card>
      </div>
    </form>
  );
}
