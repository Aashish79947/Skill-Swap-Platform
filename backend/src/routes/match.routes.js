import express from "express";
import { findMatches } from "../controllers/match.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();


router.get("/", auth, findMatches);

export default router;
