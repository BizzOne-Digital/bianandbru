import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const S = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: "" },
    bio: { type: String, default: "" },
    photo: { type: String, default: "" },
    displayOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type TeamMemberDoc = InferSchemaType<typeof S>;
export const TeamMember = (models.TeamMember as Model<TeamMemberDoc>) || model("TeamMember", S);
