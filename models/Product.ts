import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const S = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: null },
    discountPercent: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    sku: { type: String, default: "" },
    stock: { type: Number, default: 0 },
    trackInventory: { type: Boolean, default: true },
    status: { type: String, enum: ["active", "draft", "archived"], default: "active" },
    category: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    collectionRef: { type: Schema.Types.ObjectId, ref: "Collection", default: null },
    keywords: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    images: { type: [String], default: [] },
    thumbnail: { type: String, default: "" },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
  },
  { timestamps: true }
);
S.index({ published: 1, featured: 1 });

export type ProductDoc = InferSchemaType<typeof S>;
export const Product = (models.Product as Model<ProductDoc>) || model("Product", S);
