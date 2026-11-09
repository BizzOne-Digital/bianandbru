import { Schema, model, models, type Model } from "mongoose";

/** One document per content section key, e.g. "home.hero", "about", "services". */
const S = new Schema(
  {
    key: { type: String, required: true, unique: true },
    data: { type: Schema.Types.Mixed, default: {} },
    published: { type: Boolean, default: true },
  },
  { timestamps: true, minimize: false }
);

export type PageContentDoc = { key: string; data: Record<string, unknown>; published: boolean };
export const PageContent = (models.PageContent as Model<PageContentDoc>) || model("PageContent", S);
