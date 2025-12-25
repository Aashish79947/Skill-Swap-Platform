import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
} from "../controllers/auth.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Protected Routes
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

export default router;
