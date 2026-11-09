import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
const S = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);
export type CollectionDoc = InferSchemaType<typeof S>;
export const Collection = (models.Collection as Model<CollectionDoc>) || model("Collection", S);
