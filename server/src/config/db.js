import mongoose from "mongoose";

export const connectDb = async () => {
  const { MONGO_URI } = process.env;
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is required");
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(MONGO_URI);
};
