/**
 * Makes an existing database English-first and adds Spanish translations.
 *   npm run translate
 * Safe to re-run. Only updates text fields of the known starter records;
 * anything an admin created or renamed is left untouched.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import mongoose from "mongoose";
import { Product } from "../models/Product";
import { Collection } from "../models/Collection";
import { Category } from "../models/Category";
import { Testimonial } from "../models/Testimonial";
import { FAQ } from "../models/FAQ";
import { TeamMember } from "../models/TeamMember";
import { SpecialOffer } from "../models/SpecialOffer";
import { PageContent } from "../models/PageContent";
import { CATEGORY_COPY, COLLECTION_COPY, FAQ_COPY, OFFER_COPY, PRODUCT_COPY, TEAM_COPY, TESTIMONIAL_COPY } from "./translations";

/** Applies English text + Spanish translations to the starter records. */
export async function applyTranslations(verbose = true) {
  const log = (what: string, n: number) => verbose && console.log(`${what.padEnd(14)} ${n} updated`);

  let n = 0;
  for (const [slug, c] of Object.entries(PRODUCT_COPY)) n += (await Product.updateOne({ slug }, { $set: c })).modifiedCount;
  log("Products", n);

  n = 0;
  for (const [slug, c] of Object.entries(COLLECTION_COPY)) n += (await Collection.updateOne({ slug }, { $set: c })).modifiedCount;
  log("Collections", n);

  n = 0;
  for (const [slug, c] of Object.entries(CATEGORY_COPY)) n += (await Category.updateOne({ slug }, { $set: c })).modifiedCount;
  log("Categories", n);

  n = 0;
  for (const [name, c] of Object.entries(TESTIMONIAL_COPY)) n += (await Testimonial.updateOne({ name }, { $set: c })).modifiedCount;
  log("Testimonials", n);

  n = 0;
  for (const f of FAQ_COPY) {
    const { match, ...set } = f;
    n += (await FAQ.updateOne({ question: { $in: match } }, { $set: set })).modifiedCount;
  }
  log("FAQs", n);

  n = 0;
  for (const [name, c] of Object.entries(TEAM_COPY)) n += (await TeamMember.updateOne({ name: { $in: [name, c.name] } }, { $set: c })).modifiedCount;
  log("Team", n);

  n = 0;
  for (const [title, c] of Object.entries(OFFER_COPY)) n += (await SpecialOffer.updateOne({ title }, { $set: c })).modifiedCount;
  log("Offers", n);

}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Set MONGODB_URI in .env.local");
  await mongoose.connect(uri);
  await applyTranslations();

  // Saved page sections override the new English defaults; list them so they can be reviewed in the admin.
  const saved = await PageContent.find({ key: { $not: /\.es$/ } }).select("key").lean();
  if (saved.length) console.log(`\nSaved page sections (review their English text in Admin → Home & Pages): ${saved.map((d) => d.key).join(", ")}`);
  else console.log("\nNo saved page sections — the site uses the new English defaults.");

  await mongoose.disconnect();
}

if (process.argv[1]?.includes("translate-content")) main().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect();
  process.exit(1);
});
