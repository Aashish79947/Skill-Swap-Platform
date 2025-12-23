import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import auth from "../middleware/auth.middleware.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * REGISTER
 * POST /api/auth/register
 */
router.post("/register", register);

/**
 * LOGIN
 * POST /api/auth/login
 */
router.post("/login", login);

/**
 * GET CURRENT USER PROFILE
 * GET /api/auth/profile
 */
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Profile load error:", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
});

export default router;
