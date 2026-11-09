import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getProducts } from "@/lib/data";
import { serialize } from "@/lib/utils";
import { Product } from "@/models/Product";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ids = url.searchParams.get("ids");
  if (ids) {
    const list = ids.split(",").filter((id) => /^[a-f0-9]{24}$/.test(id)).slice(0, 50);
    try {
      await connectDB();
      const docs = await Product.find({ _id: { $in: list }, published: true, status: "active" }).select("name slug price thumbnail images").lean();
      return NextResponse.json({ products: serialize(docs) });
    } catch {
      return NextResponse.json({ products: [] }, { status: 500 });
    }
  }
  const q = (url.searchParams.get("q") || "").trim().slice(0, 80);
  if (q.length < 2) return NextResponse.json({ products: [] });
  const products = await getProducts({ q, limit: 8 });
  if (!products) return NextResponse.json({ products: [], error: "Search unavailable" }, { status: 500 });
  return NextResponse.json({
    products: products.map(({ _id, name, slug, price, thumbnail, images }) => ({ _id, name, slug, price, thumbnail, images })),
  });
}
