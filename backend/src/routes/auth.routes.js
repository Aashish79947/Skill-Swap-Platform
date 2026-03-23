import express from "express";
import passport from "../config/passport.js";
import {
  register,
  login,
  getProfile,
  updateProfile,
  googleAuth,
  googleCallback,
} from "../controllers/auth.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", getProfile);

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

// Google OAuth routes
router.get("/google", 
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);

export default router;
