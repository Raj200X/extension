import express from "express";
import { User } from "../models/User.js";
import { CanonicalQuestion } from "../models/CanonicalQuestion.js";
import { UserSolve } from "../models/UserSolve.js";
import { requireAuth } from "../utils/authMiddleware.js";
import { mockStore, useMockStore } from "../utils/mockStore.js";

const router = express.Router();

router.get("/me", requireAuth, async (req, res) => {
  try {
    if (useMockStore()) {
      const user = mockStore.findUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const total = mockStore.listQuestions().length;
      const solves = mockStore.listSolvesByUser(user.id);
      const solvedCount = solves.length;
      const coverage = total ? Math.round((solvedCount / total) * 100) : 0;
      return res.json({
        user: { id: user.id, name: user.name, username: user.username, email: user.email, handles: user.handles },
        stats: { total, solvedCount, coverage },
        solves
      });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const total = await CanonicalQuestion.countDocuments();
    const solves = await UserSolve.find({ userId: user._id });
    const solvedCount = solves.length;
    const coverage = total ? Math.round((solvedCount / total) * 100) : 0;
    return res.json({
      user: { id: user._id, name: user.name, username: user.username, email: user.email, handles: user.handles },
      stats: { total, solvedCount, coverage },
      solves
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load profile" });
  }
});

router.get("/:username", async (req, res) => {
  try {
    if (useMockStore()) {
      const user = mockStore.findUserByUsername(req.params.username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const total = mockStore.listQuestions().length;
      const solves = mockStore.listSolvesByUser(user.id);
      const solvedCount = solves.length;
      const coverage = total ? Math.round((solvedCount / total) * 100) : 0;
      return res.json({
        user: { id: user.id, name: user.name, username: user.username, handles: user.handles },
        stats: { total, solvedCount, coverage },
        solves
      });
    }
    const user = await User.findOne({ username: req.params.username.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const total = await CanonicalQuestion.countDocuments();
    const solves = await UserSolve.find({ userId: user._id });
    const solvedCount = solves.length;
    const coverage = total ? Math.round((solvedCount / total) * 100) : 0;
    return res.json({
      user: { id: user._id, name: user.name, username: user.username, handles: user.handles },
      stats: { total, solvedCount, coverage },
      solves
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load public profile" });
  }
});

export default router;
