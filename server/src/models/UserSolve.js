import mongoose from "mongoose";

const userSolveSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    canonicalQuestionId: { type: mongoose.Schema.Types.ObjectId, ref: "CanonicalQuestion", required: true },
    platform: { type: String, required: true, trim: true },
    status: { type: String, enum: ["solved"], default: "solved" },
    verified: { type: Boolean, default: false },
    source: { type: String, enum: ["extension", "manual"], default: "manual" },
    questionTitle: { type: String, trim: true },
    problemSlug: { type: String, trim: true }
  },
  { timestamps: true }
);

userSolveSchema.index({ userId: 1, canonicalQuestionId: 1, platform: 1 }, { unique: true });

export const UserSolve = mongoose.model("UserSolve", userSolveSchema);
