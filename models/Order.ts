import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/** Order request. paymentStatus stays "unpaid" until a real payment gateway confirms it. */
const Item = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    name: String,
    slug: String,
    price: Number,
    quantity: Number,
    image: String,
  },
  { _id: false }
);

const S = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    items: { type: [Item], default: [] },
    subtotal: Number,
    discount: Number,
    total: Number,
    currency: { type: String, default: "USD" },
    customer: {
      name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      zip: String,
      notes: String,
    },
    status: { type: String, enum: ["pending", "processing", "fulfilled", "cancelled"], default: "pending" },
    paymentStatus: { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid" },
  },
  { timestamps: true }
);

export type OrderDoc = InferSchemaType<typeof S>;
export const Order = (models.Order as Model<OrderDoc>) || model("Order", S);
