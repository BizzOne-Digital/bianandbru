import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { EMPTY_PRODUCT, ProductForm, type ProductFormValues } from "@/components/admin/ProductForm";
import { connectDB } from "@/lib/db";
import { serialize } from "@/lib/utils";
import { Product } from "@/models/Product";

export const metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f0-9]{24}$/.test(id)) notFound();
  await connectDB();
  const doc = await Product.findById(id).lean();
  if (!doc) notFound();
  const p = serialize<ProductFormValues & { category: string | null; collectionRef: string | null }>(doc);
  const initial: ProductFormValues = {
    ...EMPTY_PRODUCT,
    ...p,
    compareAtPrice: p.compareAtPrice ?? "",
    category: p.category ? String(p.category) : "",
    collectionRef: p.collectionRef ? String(p.collectionRef) : "",
  };
  return (
    <>
      <Link href="/admin/products" className="mb-3 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-navy">
        <ChevronLeft aria-hidden className="h-4 w-4" /> Products
      </Link>
      <h1 className="mb-6 font-sans text-2xl font-bold text-slate-900">{p.name}</h1>
      <ProductForm key={String(doc.updatedAt)} initial={initial} />
    </>
  );
}
