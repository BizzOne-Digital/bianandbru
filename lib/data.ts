import "server-only";
import { cache } from "react";
import { connectDB } from "@/lib/db";
import { escapeRegex, serialize } from "@/lib/utils";
import { localizeSettings, mergeTranslation, SECTION_MAP, SETTINGS_DEFAULTS, type SiteSettingsData } from "@/lib/content-defaults";
import { getLang } from "@/lib/lang";
import type { Lang } from "@/lib/i18n";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { Collection } from "@/models/Collection";
import { Testimonial } from "@/models/Testimonial";
import { TeamMember } from "@/models/TeamMember";
import { FAQ } from "@/models/FAQ";
import { SpecialOffer } from "@/models/SpecialOffer";
import { SiteSettings } from "@/models/SiteSettings";
import { PageContent } from "@/models/PageContent";

export type ProductDTO = {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  discountPercent: number;
  currency: string;
  sku: string;
  stock: number;
  trackInventory: boolean;
  status: string;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  published: boolean;
  images: string[];
  thumbnail: string;
  keywords: string[];
  seoTitle: string;
  seoDescription: string;
  category: { _id: string; name: string; slug: string } | null;
  collectionRef: { _id: string; name: string; slug: string } | null;
  createdAt: string;
  updatedAt: string;
};

export type TaxonomyDTO = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  featured?: boolean;
  displayOrder: number;
  published: boolean;
};

export type TestimonialDTO = { _id: string; name: string; photo: string; rating: number; review: string; location: string; featured: boolean };
export type TeamDTO = { _id: string; name: string; role: string; bio: string; photo: string };
export type FaqDTO = { _id: string; question: string; answer: string; category: string };
export type OfferDTO = { _id: string; title: string; description: string; discountLabel: string; image: string; ctaLabel: string; ctaHref: string };

function log(where: string, e: unknown) {
  console.error(`[data:${where}]`, e instanceof Error ? e.message : e);
}

/** Swaps `field` for `fieldEs` on Spanish pages when a translation exists. */
function localize<T>(obj: T, fields: string[], lang: Lang): T {
  if (lang !== "es" || !obj || typeof obj !== "object") return obj;
  const o = { ...(obj as Record<string, unknown>) };
  for (const f of fields) {
    const es = o[`${f}Es`];
    if (typeof es === "string" && es.trim()) o[f] = es;
  }
  return o as T;
}

const TAX_FIELDS = ["name", "description"];
const PRODUCT_FIELDS = ["name", "shortDescription", "description", "seoTitle", "seoDescription"];

function localizeProduct(p: ProductDTO, lang: Lang): ProductDTO {
  const out = localize(p, PRODUCT_FIELDS, lang);
  return {
    ...out,
    category: out.category ? localize(out.category, ["name"], lang) : null,
    collectionRef: out.collectionRef ? localize(out.collectionRef, ["name"], lang) : null,
  };
}

async function localizeProducts(list: ProductDTO[]) {
  const lang = await getLang();
  return list.map((p) => localizeProduct(p, lang));
}

const loadSettings = cache(async (): Promise<SiteSettingsData> => {
  try {
    await connectDB();
    const doc = await SiteSettings.findOne({ key: "main" }).lean();
    return { ...SETTINGS_DEFAULTS, ...((doc?.data as Partial<SiteSettingsData>) || {}) };
  } catch (e) {
    log("settings", e);
    return SETTINGS_DEFAULTS;
  }
});

/** Site settings in the visitor's language. */
export const getSettings = cache(async (): Promise<SiteSettingsData> => localizeSettings(await loadSettings(), await getLang()));

/** Returns section data merged over defaults. `published=false` hides it on the site. */
/**
 * English content is stored under `key`, the Spanish translation under `key.es`.
 * Spanish = English data with translated text layered on top (images/links shared).
 */
export const getSection = cache(async <T = Record<string, unknown>>(key: string): Promise<{ data: T; published: boolean }> => {
  const def = SECTION_MAP[key];
  const defaults = def?.defaults ?? {};
  const lang = await getLang();
  const withLang = (base: Record<string, unknown>, esDoc?: Record<string, unknown>) =>
    lang === "es" ? (mergeTranslation(base, mergeTranslation(def?.defaultsEs ?? {}, esDoc ?? {})) as T) : (base as T);
  try {
    await connectDB();
    const [doc, esDoc] = await Promise.all([
      PageContent.findOne({ key }).lean(),
      lang === "es" ? PageContent.findOne({ key: `${key}.es` }).lean() : Promise.resolve(null),
    ]);
    const base = { ...defaults, ...(doc?.data || {}) };
    return { data: withLang(base, esDoc?.data), published: doc ? doc.published !== false : true };
  } catch (e) {
    log(`section:${key}`, e);
    return { data: withLang(defaults), published: true };
  }
});

const PRODUCT_POPULATE = [
  { path: "category", select: "name nameEs slug" },
  { path: "collectionRef", select: "name nameEs slug" },
];

const PUBLIC_PRODUCT: Record<string, unknown> = { published: true, status: "active" };

export type ShopQuery = {
  q?: string;
  collection?: string;
  category?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
};

/** Returns null when the database is unavailable so pages can show an error state. */
export async function getProducts(query: ShopQuery = {}): Promise<ProductDTO[] | null> {
  try {
    await connectDB();
    const filter: Record<string, unknown> = { ...PUBLIC_PRODUCT };

    if (query.collection) {
      const c = await Collection.findOne({ slug: String(query.collection), published: true }).select("_id").lean();
      if (!c) return [];
      filter.collectionRef = c._id;
    }
    if (query.category) {
      const c = await Category.findOne({ slug: String(query.category), published: true }).select("_id").lean();
      if (!c) return [];
      filter.category = c._id;
    }
    if (query.q) {
      const rx = new RegExp(escapeRegex(String(query.q).slice(0, 80)), "i");
      const [cats, cols] = await Promise.all([
        Category.find({ $or: [{ name: rx }, { nameEs: rx }] }).select("_id").lean(),
        Collection.find({ $or: [{ name: rx }, { nameEs: rx }] }).select("_id").lean(),
      ]);
      filter.$or = [
        { name: rx },
        { nameEs: rx },
        { shortDescription: rx },
        { shortDescriptionEs: rx },
        { description: rx },
        { descriptionEs: rx },
        { keywords: rx },
        { category: { $in: cats.map((c) => c._id) } },
        { collectionRef: { $in: cols.map((c) => c._id) } },
      ];
    }
    if (query.minPrice != null || query.maxPrice != null) {
      filter.price = {
        ...(query.minPrice != null ? { $gte: Number(query.minPrice) } : {}),
        ...(query.maxPrice != null ? { $lte: Number(query.maxPrice) } : {}),
      };
    }

    let sort: Record<string, 1 | -1> = { featured: -1, createdAt: -1 };
    switch (query.sort) {
      case "price-asc":
        sort = { price: 1 };
        break;
      case "price-desc":
        sort = { price: -1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
      case "featured":
        filter.featured = true;
        break;
      case "discounted":
        filter.discountPercent = { $gt: 0 };
        sort = { discountPercent: -1 };
        break;
    }

    const docs = await Product.find(filter)
      .select("-description")
      .sort(sort)
      .limit(Math.min(query.limit ?? 60, 100))
      .populate(PRODUCT_POPULATE)
      .lean();
    return localizeProducts(serialize<ProductDTO[]>(docs));
  } catch (e) {
    log("products", e);
    return null;
  }
}

export async function getFeaturedProducts(limit = 3): Promise<ProductDTO[]> {
  try {
    await connectDB();
    let docs = await Product.find({ ...PUBLIC_PRODUCT, featured: true }).sort({ updatedAt: -1 }).limit(limit).populate(PRODUCT_POPULATE).lean();
    if (docs.length < limit) {
      const more = await Product.find({ ...PUBLIC_PRODUCT, _id: { $nin: docs.map((d) => (d as { _id: unknown })._id) } })
        .sort({ createdAt: -1 })
        .limit(limit - docs.length)
        .populate(PRODUCT_POPULATE)
        .lean();
      docs = [...docs, ...more];
    }
    return localizeProducts(serialize<ProductDTO[]>(docs));
  } catch (e) {
    log("featured", e);
    return [];
  }
}

export async function getBestSellers(limit = 4): Promise<ProductDTO[]> {
  try {
    await connectDB();
    const docs = await Product.find(PUBLIC_PRODUCT)
      .select("-description")
      .sort({ bestSeller: -1, newArrival: -1, createdAt: -1 })
      .limit(Math.min(limit, 12))
      .populate(PRODUCT_POPULATE)
      .lean();
    return localizeProducts(serialize<ProductDTO[]>(docs));
  } catch (e) {
    log("bestsellers", e);
    return [];
  }
}

export const getProductBySlug = cache(async (slug: string): Promise<ProductDTO | null> => {
  try {
    await connectDB();
    const doc = await Product.findOne({ slug: String(slug), ...PUBLIC_PRODUCT }).populate(PRODUCT_POPULATE).lean();
    return doc ? localizeProduct(serialize<ProductDTO>(doc), await getLang()) : null;
  } catch (e) {
    log("product", e);
    return null;
  }
});

export async function getRelatedProducts(p: ProductDTO, limit = 4): Promise<ProductDTO[]> {
  try {
    await connectDB();
    const or: Record<string, unknown>[] = [];
    if (p.category?._id) or.push({ category: p.category._id });
    if (p.collectionRef?._id) or.push({ collectionRef: p.collectionRef._id });
    const filter: Record<string, unknown> = { ...PUBLIC_PRODUCT, _id: { $ne: p._id } };
    if (or.length) filter.$or = or;
    const docs = await Product.find(filter).limit(limit).populate(PRODUCT_POPULATE).lean();
    return localizeProducts(serialize<ProductDTO[]>(docs));
  } catch (e) {
    log("related", e);
    return [];
  }
}

export async function getCollections(): Promise<TaxonomyDTO[]> {
  try {
    await connectDB();
    const lang = await getLang();
    return serialize<TaxonomyDTO[]>(await Collection.find({ published: true }).sort({ displayOrder: 1, createdAt: 1 }).lean()).map((c) => localize(c, TAX_FIELDS, lang));
  } catch (e) {
    log("collections", e);
    return [];
  }
}

export async function getCategories(): Promise<TaxonomyDTO[]> {
  try {
    await connectDB();
    const lang = await getLang();
    return serialize<TaxonomyDTO[]>(await Category.find({ published: true }).sort({ displayOrder: 1, name: 1 }).lean()).map((c) => localize(c, TAX_FIELDS, lang));
  } catch (e) {
    log("categories", e);
    return [];
  }
}

export async function getTestimonials(opts: { featuredFirst?: boolean; limit?: number } = {}): Promise<TestimonialDTO[]> {
  try {
    await connectDB();
    const sort: Record<string, 1 | -1> = opts.featuredFirst ? { featured: -1, displayOrder: 1, createdAt: -1 } : { displayOrder: 1, createdAt: -1 };
    const lang = await getLang();
    return serialize<TestimonialDTO[]>(await Testimonial.find({ published: true }).sort(sort).limit(opts.limit ?? 100).lean()).map((t) => localize(t, ["review", "location"], lang));
  } catch (e) {
    log("testimonials", e);
    return [];
  }
}

export async function getTeam(): Promise<TeamDTO[]> {
  try {
    await connectDB();
    const lang = await getLang();
    return serialize<TeamDTO[]>(await TeamMember.find({ published: true }).sort({ displayOrder: 1 }).lean()).map((m) => localize(m, ["name", "role", "bio"], lang));
  } catch (e) {
    log("team", e);
    return [];
  }
}

export async function getFaqs(): Promise<FaqDTO[]> {
  try {
    await connectDB();
    const lang = await getLang();
    return serialize<FaqDTO[]>(await FAQ.find({ published: true }).sort({ category: 1, displayOrder: 1 }).lean()).map((f) => localize(f, ["question", "answer", "category"], lang));
  } catch (e) {
    log("faqs", e);
    return [];
  }
}

export async function getOffers(): Promise<OfferDTO[]> {
  try {
    await connectDB();
    const lang = await getLang();
    return serialize<OfferDTO[]>(await SpecialOffer.find({ published: true }).sort({ displayOrder: 1 }).lean()).map((o) => localize(o, ["title", "description", "discountLabel", "ctaLabel"], lang));
  } catch (e) {
    log("offers", e);
    return [];
  }
}
