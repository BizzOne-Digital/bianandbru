import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

export const BOOKING_STATUSES = ["New", "Contacted", "Completed", "Cancelled"] as const;

const S = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    reason: { type: String, default: "" },
    preferredDate: { type: String, default: "" },
    preferredTime: { type: String, default: "" },
    message: { type: String, default: "" },
    status: { type: String, enum: BOOKING_STATUSES, default: "New" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export type BookingDoc = InferSchemaType<typeof S>;
export const Booking = (models.Booking as Model<BookingDoc>) || model("Booking", S);
