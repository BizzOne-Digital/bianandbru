import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { EMPTY_PRODUCT, ProductForm } from "@/components/admin/ProductForm";

export const metadata = { title: "New product" };

export default function NewProductPage() {
  return (
    <>
      <Link href="/admin/products" className="mb-3 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-navy">
        <ChevronLeft aria-hidden className="h-4 w-4" /> Products
      </Link>
      <h1 className="mb-6 font-sans text-2xl font-bold text-slate-900">New product</h1>
      <ProductForm initial={EMPTY_PRODUCT} />
    </>
  );
}
