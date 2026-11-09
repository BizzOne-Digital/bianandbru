import { Schema, model, models, type Model } from "mongoose";

const S = new Schema(
  { email: { type: String, required: true, unique: true, lowercase: true, trim: true } },
  { timestamps: true }
);

export const NewsletterSubscriber =
  (models.NewsletterSubscriber as Model<{ email: string }>) || model("NewsletterSubscriber", S);
