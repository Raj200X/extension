import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDb } from "./config/db.js";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.js";
import questionRoutes from "./routes/questions.js";
import solveRoutes from "./routes/solve.js";
import userRoutes from "./routes/users.js";
import { useMockStore } from "./utils/mockStore.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(passport.initialize());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/solve", solveRoutes);
app.use("/api/users", userRoutes);

const start = async () => {
  try {
    if (!useMockStore()) {
      await connectDb();
    } else {
      console.log("Running with mock in-memory store (no MongoDB).");
    }
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

start();
