import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const S = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    discountLabel: { type: String, default: "" },
    image: { type: String, default: "" },
    ctaLabel: { type: String, default: "Ver Ofertas" },
    ctaHref: { type: String, default: "/shop?sort=discounted" },
    displayOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type SpecialOfferDoc = InferSchemaType<typeof S>;
export const SpecialOffer = (models.SpecialOffer as Model<SpecialOfferDoc>) || model("SpecialOffer", S);
