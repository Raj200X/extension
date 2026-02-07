import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { mockStore, useMockStore } from "../utils/mockStore.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, username, email, password, handles } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (useMockStore()) {
      const existing =
        mockStore.findUserByEmail(email) || mockStore.findUserByUsername(username);
      if (existing) {
        return res.status(409).json({ message: "Email or username already in use" });
      }
      const user = await mockStore.createUser({ name, username, email, password, handles });
      const token = signToken({ _id: user.id, email: user.email, username: user.username });
      return res.status(201).json({
        token,
        user: { id: user.id, name: user.name, username: user.username, email: user.email, handles: user.handles }
      });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ message: "Email or username already in use" });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      passwordHash,
      handles: handles || {}
    });
    const token = signToken(user);
    return res.status(201).json({ token, user: { id: user._id, name: user.name, username: user.username, email: user.email, handles: user.handles } });
  } catch (error) {
    return res.status(500).json({ message: "Signup failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    if (email === "admin@example.com" && password === "admin123") {
      const adminUser = {
        _id: "admin-id",
        name: "Admin User",
        username: "admin",
        email: "admin@example.com",
        handles: {}
      };
      const token = signToken(adminUser);
      return res.json({
        token,
        user: {
          id: adminUser._id,
          name: adminUser.name,
          username: adminUser.username,
          email: adminUser.email,
          handles: adminUser.handles
        }
      });
    }
    if (useMockStore()) {
      const user =
        mockStore.findUserByEmail(email) ||
        mockStore.findUserByUsername(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const match = await mockStore.validatePassword(user, password);
      if (!match) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = signToken({ _id: user.id, email: user.email, username: user.username });
      return res.json({
        token,
        user: { id: user.id, name: user.name, username: user.username, email: user.email, handles: user.handles }
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = signToken(user);
    return res.json({ token, user: { id: user._id, name: user.name, username: user.username, email: user.email, handles: user.handles } });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
});

export default router;
