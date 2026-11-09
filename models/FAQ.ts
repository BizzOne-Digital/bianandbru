import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const S = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: "General" },
    displayOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type FAQDoc = InferSchemaType<typeof S>;
export const FAQ = (models.FAQ as Model<FAQDoc>) || model("FAQ", S);
