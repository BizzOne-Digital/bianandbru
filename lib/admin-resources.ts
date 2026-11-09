import "server-only";
import type { Model } from "mongoose";
import type { z } from "zod";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { Collection } from "@/models/Collection";
import { TeamMember } from "@/models/TeamMember";
import { Testimonial } from "@/models/Testimonial";
import { FAQ } from "@/models/FAQ";
import { SpecialOffer } from "@/models/SpecialOffer";
import { Booking } from "@/models/Booking";
import { Order } from "@/models/Order";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";
import {
  bookingUpdateSchema,
  faqSchema,
  offerSchema,
  productSchema,
  taxonomySchema,
  teamSchema,
  testimonialSchema,
} from "@/lib/validations";
import { z as zod } from "zod";
import { discountPercent } from "@/lib/utils";

type Resource = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: Model<any>;
  createSchema?: z.ZodObject;
  updateSchema: z.ZodObject;
  /** Fields that may hold /api/uploads/ URLs (for cleanup on replace/delete). */
  imageFields: string[];
  sort: Record<string, 1 | -1>;
  searchFields: string[];
  populate?: { path: string; select: string }[];
  beforeSave?: (data: Record<string, unknown>) => Record<string, unknown>;
  /** Taxonomies: clear references on delete. */
  onDelete?: (id: string) => Promise<void>;
};

const productBeforeSave = (d: Record<string, unknown>) => {
  if (typeof d.price === "number") {
    const cmp = d.compareAtPrice as number | null | undefined;
    d.discountPercent = discountPercent(d.price, cmp);
    if (!cmp || cmp <= d.price) d.compareAtPrice = null;
  }
  if (Array.isArray(d.images) && typeof d.thumbnail === "string" && !d.thumbnail && d.images.length) d.thumbnail = d.images[0];
  return d;
};

export const RESOURCES: Record<string, Resource> = {
  products: {
    model: Product,
    createSchema: productSchema,
    updateSchema: productSchema.partial(),
    imageFields: ["images", "thumbnail"],
    sort: { createdAt: -1 },
    searchFields: ["name", "sku", "slug"],
    populate: [
      { path: "category", select: "name" },
      { path: "collectionRef", select: "name" },
    ],
    beforeSave: productBeforeSave,
  },
  categories: {
    model: Category,
    createSchema: taxonomySchema,
    updateSchema: taxonomySchema.partial(),
    imageFields: ["image"],
    sort: { displayOrder: 1, name: 1 },
    searchFields: ["name", "slug"],
    onDelete: async (id) => {
      await Product.updateMany({ category: id }, { $set: { category: null } });
    },
  },
  collections: {
    model: Collection,
    createSchema: taxonomySchema,
    updateSchema: taxonomySchema.partial(),
    imageFields: ["image"],
    sort: { displayOrder: 1, name: 1 },
    searchFields: ["name", "slug"],
    onDelete: async (id) => {
      await Product.updateMany({ collectionRef: id }, { $set: { collectionRef: null } });
    },
  },
  team: {
    model: TeamMember,
    createSchema: teamSchema,
    updateSchema: teamSchema.partial(),
    imageFields: ["photo"],
    sort: { displayOrder: 1 },
    searchFields: ["name", "role"],
  },
  testimonials: {
    model: Testimonial,
    createSchema: testimonialSchema,
    updateSchema: testimonialSchema.partial(),
    imageFields: ["photo"],
    sort: { displayOrder: 1, createdAt: -1 },
    searchFields: ["name", "review", "location"],
  },
  faqs: {
    model: FAQ,
    createSchema: faqSchema,
    updateSchema: faqSchema.partial(),
    imageFields: [],
    sort: { category: 1, displayOrder: 1 },
    searchFields: ["question", "answer", "category"],
  },
  offers: {
    model: SpecialOffer,
    createSchema: offerSchema,
    updateSchema: offerSchema.partial(),
    imageFields: ["image"],
    sort: { displayOrder: 1 },
    searchFields: ["title"],
  },
  bookings: {
    model: Booking,
    updateSchema: bookingUpdateSchema,
    imageFields: [],
    sort: { createdAt: -1 },
    searchFields: ["name", "email", "phone", "reason"],
  },
  orders: {
    model: Order,
    updateSchema: zod.object({
      status: zod.enum(["pending", "processing", "fulfilled", "cancelled"]).optional(),
      paymentStatus: zod.enum(["unpaid", "paid", "refunded"]).optional(),
    }),
    imageFields: [],
    sort: { createdAt: -1 },
    searchFields: ["orderNumber", "customer.name", "customer.email"],
  },
  subscribers: {
    model: NewsletterSubscriber,
    updateSchema: zod.object({}),
    imageFields: [],
    sort: { createdAt: -1 },
    searchFields: ["email"],
  },
};

export function imageValues(doc: Record<string, unknown> | null | undefined, fields: string[]): string[] {
  if (!doc) return [];
  return fields.flatMap((f) => {
    const v = doc[f];
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : typeof v === "string" ? [v] : [];
  });
}
