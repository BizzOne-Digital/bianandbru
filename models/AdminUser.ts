import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const S = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "Admin" },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

export type AdminUserDoc = InferSchemaType<typeof S>;
export const AdminUser = (models.AdminUser as Model<AdminUserDoc>) || model("AdminUser", S);
