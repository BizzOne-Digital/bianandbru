import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const S = new Schema(
  {
    folder: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);
S.index({ folder: 1, filename: 1 }, { unique: true });

export type StoredUploadDoc = InferSchemaType<typeof S>;
export const StoredUpload = (models.StoredUpload as Model<StoredUploadDoc>) || model("StoredUpload", S);
