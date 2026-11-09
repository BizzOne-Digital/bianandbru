import { Schema, model, models, type Model } from "mongoose";

/** Singleton (key "main"). Shape: SiteSettingsData in lib/content-defaults.ts */
const S = new Schema(
  { key: { type: String, default: "main", unique: true }, data: { type: Schema.Types.Mixed, default: {} } },
  { timestamps: true, minimize: false }
);

export const SiteSettings =
  (models.SiteSettings as Model<{ key: string; data: Record<string, unknown> }>) || model("SiteSettings", S);
