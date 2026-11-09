import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const S = new Schema(
  {
    name: { type: String, required: true },
    photo: { type: String, default: "" },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    review: { type: String, required: true },
    location: { type: String, default: "" },
    published: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type TestimonialDoc = InferSchemaType<typeof S>;
export const Testimonial = (models.Testimonial as Model<TestimonialDoc>) || model("Testimonial", S);
