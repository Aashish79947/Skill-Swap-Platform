import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
} from "../controllers/auth.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.get("/me",getProfile)

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

export default router;
