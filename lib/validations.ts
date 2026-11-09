import { z } from "zod";

/** Accepts our Mongo upload URLs, static /images paths, or HTTPS URLs. Empty allowed. */
export const imageUrl = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (v) => v === "" || v.startsWith("/api/uploads/") || v.startsWith("/images/") || /^https:\/\/[^\s]+$/.test(v),
    "Invalid image URL"
  );

const slug = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug may only contain lowercase letters, numbers and dashes");

const objectId = z
  .string()
  .regex(/^[a-f0-9]{24}$/)
  .nullable()
  .optional()
  .or(z.literal("").transform(() => null));

const money = z.coerce.number().min(0, "Must be 0 or more").max(1_000_000);

export const productSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(160),
  slug,
  shortDescription: z.string().trim().max(400).default(""),
  description: z.string().trim().max(10000).default(""),
  price: money,
  compareAtPrice: money.nullable().optional(),
  currency: z.string().trim().length(3).default("USD"),
  sku: z.string().trim().max(64).default(""),
  stock: z.coerce.number().int().min(0).max(1_000_000),
  trackInventory: z.boolean().default(true),
  status: z.enum(["active", "draft", "archived"]).default("active"),
  category: objectId,
  collectionRef: objectId,
  keywords: z.array(z.string().trim().max(60)).max(30).default([]),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  published: z.boolean().default(true),
  images: z.array(imageUrl).max(12).default([]),
  thumbnail: imageUrl.default(""),
  seoTitle: z.string().trim().max(160).default(""),
  seoDescription: z.string().trim().max(320).default(""),
});

export const taxonomySchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug,
  description: z.string().trim().max(1000).default(""),
  image: imageUrl.default(""),
  featured: z.boolean().default(false),
  displayOrder: z.coerce.number().int().min(0).max(9999).default(0),
  published: z.boolean().default(true),
});

export const teamSchema = z.object({
  name: z.string().trim().min(2).max(120),
  role: z.string().trim().max(120).default(""),
  bio: z.string().trim().max(2000).default(""),
  photo: imageUrl.default(""),
  displayOrder: z.coerce.number().int().min(0).max(9999).default(0),
  published: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  name: z.string().trim().min(2).max(120),
  photo: imageUrl.default(""),
  rating: z.coerce.number().int().min(1).max(5),
  review: z.string().trim().min(5).max(2000),
  location: z.string().trim().max(120).default(""),
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
  displayOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

export const faqSchema = z.object({
  question: z.string().trim().min(5).max(300),
  answer: z.string().trim().min(2).max(4000),
  category: z.string().trim().max(60).default("General"),
  displayOrder: z.coerce.number().int().min(0).max(9999).default(0),
  published: z.boolean().default(true),
});

export const offerSchema = z.object({
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().max(1000).default(""),
  discountLabel: z.string().trim().max(60).default(""),
  image: imageUrl.default(""),
  ctaLabel: z.string().trim().max(60).default("Ver Ofertas"),
  ctaHref: z
    .string()
    .trim()
    .max(300)
    .refine((v) => v.startsWith("/") && !v.startsWith("//"), "Use an internal path, e.g. /shop")
    .default("/shop?sort=discounted"),
  displayOrder: z.coerce.number().int().min(0).max(9999).default(0),
  published: z.boolean().default(true),
});

export const bookingSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.email("Please enter a valid email").max(200),
  phone: z.string().trim().max(40).default(""),
  reason: z.string().trim().max(120).default(""),
  preferredDate: z.string().trim().max(20).default(""),
  preferredTime: z.string().trim().max(20).default(""),
  message: z.string().trim().max(3000).default(""),
  company: z.string().max(0).optional(), // honeypot
});

export const bookingUpdateSchema = z.object({
  status: z.enum(["New", "Contacted", "Completed", "Cancelled"]).optional(),
  notes: z.string().trim().max(5000).optional(),
});

export const newsletterSchema = z.object({ email: z.email("Please enter a valid email").max(200) });

export const loginSchema = z.object({
  email: z.email().max(200),
  password: z.string().min(1).max(200),
});

export const checkoutSchema = z.object({
  items: z
    .array(z.object({ productId: z.string().regex(/^[a-f0-9]{24}$/), quantity: z.coerce.number().int().min(1).max(99) }))
    .min(1, "Your cart is empty")
    .max(50),
  customer: z.object({
    name: z.string().trim().min(2, "Name is required").max(120),
    email: z.email("Valid email required").max(200),
    phone: z.string().trim().min(7, "Phone is required").max(40),
    address: z.string().trim().min(4, "Address is required").max(300),
    city: z.string().trim().min(2, "City is required").max(120),
    state: z.string().trim().max(120).default(""),
    zip: z.string().trim().min(3, "ZIP is required").max(20),
    notes: z.string().trim().max(1000).default(""),
  }),
});

export function zodMessage(err: z.ZodError) {
  const i = err.issues[0];
  return i ? `${i.path.join(".") ? i.path.join(".") + ": " : ""}${i.message}` : "Invalid input";
}
