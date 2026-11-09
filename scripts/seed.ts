/**
 * Seeds MongoDB with the BIAN&BRU starter content and the first admin user.
 *   npm run seed            → inserts anything missing (safe to re-run)
 *   npm run seed -- --reset → wipes catalog/content collections first (NOT uploads or admins)
 */
import "dotenv/config";
import { config } from "dotenv";
config({ path: ".env.local" });

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { IMG } from "../lib/content-defaults";
import { AdminUser } from "../models/AdminUser";
import { Category } from "../models/Category";
import { Collection } from "../models/Collection";
import { Product } from "../models/Product";
import { Testimonial } from "../models/Testimonial";
import { TeamMember } from "../models/TeamMember";
import { FAQ } from "../models/FAQ";
import { SpecialOffer } from "../models/SpecialOffer";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Set MONGODB_URI in .env.local");
  await mongoose.connect(uri);
  const reset = process.argv.includes("--reset");
  if (reset) {
    await Promise.all([Category, Collection, Product, Testimonial, TeamMember, FAQ, SpecialOffer].map((m) => (m as mongoose.Model<unknown>).deleteMany({})));
    console.log("Cleared catalog & content collections.");
  }

  // Admin
  const email = process.env.SEED_ADMIN_EMAIL?.toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (email && password) {
    if (password.length < 10) throw new Error("SEED_ADMIN_PASSWORD must be at least 10 characters");
    const exists = await AdminUser.findOne({ email });
    if (!exists) {
      await AdminUser.create({ email, passwordHash: await bcrypt.hash(password, 12), name: "Admin" });
      console.log(`Admin created: ${email}`);
    } else console.log(`Admin exists: ${email}`);
  } else console.warn("SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set — no admin user created.");

  const upsert = async <T extends { slug: string }>(model: mongoose.Model<T>, docs: T[]) => {
    const out: Record<string, mongoose.Types.ObjectId> = {};
    for (const d of docs) {
      const r = await model.findOneAndUpdate({ slug: d.slug }, { $setOnInsert: d }, { upsert: true, returnDocument: "after" });
      out[d.slug] = r!._id as mongoose.Types.ObjectId;
    }
    return out;
  };

  const cols = await upsert(Collection as never, [
    {
      name: "Recuerdos y Recuerdos",
      slug: "recuerdos-y-recuerdos",
      description: "Diarios de bebés, álbumes de fotos, marcos de huellas y piezas especiales.",
      image: IMG.babyFeet,
      featured: true,
      displayOrder: 1,
      published: true,
    },
    {
      name: "Baby Essentials",
      slug: "baby-essentials",
      description: "Accesorios para bebés, almohadas y elementos esenciales para el día a día.",
      image: IMG.teddyBasket,
      featured: true,
      displayOrder: 2,
      published: true,
    },
  ] as never);

  const cats = await upsert(Category as never, [
    { name: "Baby Journals", slug: "baby-journals", description: "Memory books and journals.", image: "", displayOrder: 1, published: true },
    { name: "Photo Albums & Frames", slug: "photo-albums-frames", description: "Albums, footprint frames and keepsake displays.", image: "", displayOrder: 2, published: true },
    { name: "Blankets & Pillows", slug: "blankets-pillows", description: "Soft essentials for the nursery.", image: "", displayOrder: 3, published: true },
    { name: "Plush Toys", slug: "plush-toys", description: "Cuddly companions.", image: "", displayOrder: 4, published: true },
    { name: "Accessory Sets", slug: "accessory-sets", description: "Gift-ready accessory sets.", image: "", displayOrder: 5, published: true },
  ] as never);

  const P = (o: Record<string, unknown>) => ({
    currency: "USD",
    trackInventory: true,
    status: "active",
    published: true,
    bestSeller: false,
    newArrival: false,
    featured: false,
    keywords: [],
    seoTitle: "",
    seoDescription: "",
    ...o,
    discountPercent: o.compareAtPrice ? Math.round((((o.compareAtPrice as number) - (o.price as number)) / (o.compareAtPrice as number)) * 100) : 0,
    thumbnail: (o.images as string[])[0],
  });

  await upsert(Product as never, [
    P({
      name: "Diario del Bebé (Baby Journal)",
      slug: "diario-del-bebe",
      shortDescription: "Un diario para guardar cada primer momento.",
      description:
        "Registra los primeros pasos, palabras y momentos especiales de tu bebé. Páginas guiadas, espacio para fotos y una portada suave en tonos pastel.\n\nIdeal como regalo para nuevos padres y abuelos.",
      price: 29.99,
      compareAtPrice: 34.99,
      sku: "BB-JOUR-001",
      stock: 25,
      featured: true,
      bestSeller: true,
      keywords: ["journal", "diario", "memory book", "regalo"],
      category: cats["baby-journals"],
      collectionRef: cols["recuerdos-y-recuerdos"],
      images: [IMG.babyFeet, IMG.babyTeddySleep],
    }),
    P({
      name: "Set de Accesorios para Bebé",
      slug: "set-de-accesorios-para-bebe",
      shortDescription: "Set suave de accesorios listo para regalar.",
      description: "Un set de accesorios esenciales con peluches y textiles suaves, presentado en una caja lista para regalar.",
      price: 49.99,
      compareAtPrice: 59.99,
      sku: "BB-SET-001",
      stock: 12,
      featured: true,
      keywords: ["set", "accesorios", "gift", "regalo"],
      category: cats["accessory-sets"],
      collectionRef: cols["baby-essentials"],
      images: [IMG.plushToys, IMG.teddyBasket],
    }),
    P({
      name: "Álbum de Fotos del Bebé",
      slug: "album-de-fotos-del-bebe",
      shortDescription: "Álbum de fotos para el primer año.",
      description: "Un álbum elegante con páginas para cada mes del primer año, espacio para la ecografía y notas personales.",
      price: 39.99,
      compareAtPrice: 49.99,
      sku: "BB-ALB-001",
      stock: 18,
      featured: true,
      newArrival: true,
      keywords: ["album", "fotos", "photo", "keepsake"],
      category: cats["photo-albums-frames"],
      collectionRef: cols["recuerdos-y-recuerdos"],
      images: [IMG.babyBlanket, IMG.heroBaby],
    }),
    P({
      name: "Manta Suave de Algodón",
      slug: "manta-suave-de-algodon",
      shortDescription: "Manta tejida, suave y transpirable.",
      description: "Manta de algodón tejida en tonos pastel, perfecta para la cuna, el cochecito o como regalo.",
      price: 34.99,
      sku: "BB-BLK-001",
      stock: 30,
      keywords: ["manta", "blanket", "algodón"],
      category: cats["blankets-pillows"],
      collectionRef: cols["baby-essentials"],
      images: [IMG.teddyBasket],
    }),
    P({
      name: "Osito de Peluche Clásico",
      slug: "osito-de-peluche-clasico",
      shortDescription: "El primer amigo de tu bebé.",
      description: "Osito de peluche suave con detalles bordados. Un compañero clásico que acompaña cada siesta.",
      price: 24.99,
      sku: "BB-PLU-001",
      stock: 4,
      newArrival: true,
      keywords: ["peluche", "teddy", "osito", "plush"],
      category: cats["plush-toys"],
      collectionRef: cols["baby-essentials"],
      images: [IMG.babyTeddySleep],
    }),
    P({
      name: "Marco de Huellas del Bebé",
      slug: "marco-de-huellas-del-bebe",
      shortDescription: "Guarda las primeras huellas para siempre.",
      description: "Marco con kit de huellas seguro para bebés y espacio para una foto. Un recuerdo que dura toda la vida.",
      price: 44.99,
      compareAtPrice: 52.99,
      sku: "BB-FRM-001",
      stock: 10,
      keywords: ["marco", "huellas", "footprint", "frame"],
      category: cats["photo-albums-frames"],
      collectionRef: cols["recuerdos-y-recuerdos"],
      images: [IMG.babyFeet],
    }),
  ] as never);

  if ((await Testimonial.countDocuments()) === 0) {
    await Testimonial.insertMany([
      { name: "Ana M.", photo: IMG.avatar1, rating: 5, review: "Productos hermosos y de excelente calidad. El diario del bebé es simplemente perfecto.", featured: true, published: true, displayOrder: 1 },
      { name: "Carlos R.", photo: IMG.avatar2, rating: 5, review: "Ideal para regalar a nuevos padres. Todo está cuidado hasta el mínimo detalle.", featured: true, published: true, displayOrder: 2 },
      { name: "Laura G.", photo: IMG.avatar3, rating: 5, review: "Nos encantan sus colecciones. Prácticas, bonitas y con mucho significado.", featured: true, published: true, displayOrder: 3 },
      { name: "Miguel T.", photo: IMG.avatar4, rating: 5, review: "Compré el álbum para mi nieta y toda la familia quedó encantada.", published: true, displayOrder: 4 },
    ]);
  }
  if ((await TeamMember.countDocuments()) === 0) {
    await TeamMember.insertMany([
      { name: "Fundadora", role: "Founder & Curator", bio: "Selecciona cada producto pensando en las familias y en los recuerdos que perduran.", photo: IMG.avatar5, displayOrder: 1, published: true },
    ]);
  }
  if ((await FAQ.countDocuments()) === 0) {
    await FAQ.insertMany([
      { category: "Orders", question: "How do I place an order?", answer: "Add products to your cart and submit the checkout form. Our team will contact you to confirm availability, shipping and payment.", displayOrder: 1 },
      { category: "Orders", question: "Can I send a product as a gift?", answer: "Yes. Add a gift message in the order notes and we will include it.", displayOrder: 2 },
      { category: "Shipping", question: "How long does shipping take?", answer: "Delivery times depend on your location. We confirm the estimated delivery date with you before payment.", displayOrder: 1 },
      { category: "Products", question: "¿Los productos son seguros para bebés?", answer: "Sí. Seleccionamos productos con materiales suaves y seguros para los más pequeños.", displayOrder: 1 },
    ]);
  }
  if ((await SpecialOffer.countDocuments()) === 0) {
    await SpecialOffer.insertMany([
      { title: "Keepsakes on sale", description: "Up to 20% off journals, albums and frames.", discountLabel: "Hasta -20%", image: IMG.giftPink, ctaLabel: "Ver Ofertas", ctaHref: "/shop?sort=discounted", displayOrder: 1 },
    ]);
  }

  console.log("Seed complete.");
  await mongoose.disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect();
  process.exit(1);
});
