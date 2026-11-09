import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import { SITE_URL } from "@/lib/utils";
import { Product } from "@/models/Product";

const STATIC = ["", "/about", "/team", "/services", "/pricing", "/faq", "/testimonials", "/booking", "/shop", "/privacy", "/terms"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = STATIC.map((p) => ({ url: `${SITE_URL}${p}`, lastModified: now, changeFrequency: "weekly", priority: p === "" ? 1 : 0.7 }));
  try {
    await connectDB();
    const products = await Product.find({ published: true, status: "active" }).select("slug updatedAt").lean();
    return [
      ...pages,
      ...products.map((p) => ({ url: `${SITE_URL}/shop/${p.slug}`, lastModified: p.updatedAt as Date, changeFrequency: "weekly" as const, priority: 0.8 })),
    ];
  } catch {
    return pages;
  }
}
