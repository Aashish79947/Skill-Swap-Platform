import express from "express";
import auth from "../middleware/auth.middleware.js";
import { createReview, getUserReviews } from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", auth, createReview);
router.get("/user/:userId", getUserReviews);

export default router;
