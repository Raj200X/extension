import mongoose from "mongoose";

const handlesSchema = new mongoose.Schema(
  {
    leetcode: { type: String, trim: true },
    gfg: { type: String, trim: true },
    codeforces: { type: String, trim: true },
    hackerrank: { type: String, trim: true },
    codechef: { type: String, trim: true },
    spoj: { type: String, trim: true },
    atcoder: { type: String, trim: true }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    handles: { type: handlesSchema, default: {} }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
