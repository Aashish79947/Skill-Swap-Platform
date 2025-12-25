import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
  createSkill,
  getMySkills,
  getMarketplace,
  updateSkill,
  deleteSkill,
} from "../controllers/skill.controller.js";

const router = express.Router();

/* ===============================
   CREATE SKILL
   POST /api/skills
================================ */
router.post("/", auth, createSkill);

/* ===============================
   GET MY SKILLS (PROFILE)
   GET /api/skills/my
================================ */
router.get("/my", auth, getMySkills);

/* ===============================
   MARKETPLACE (OTHER USERS)
   GET /api/skills/marketplace
================================ */
router.get("/marketplace", auth, getMarketplace);

/* ===============================
   GET MY SKILLS (DASHBOARD)
   GET /api/skills
   (optional, but safe to keep)
================================ */
router.get("/", auth, getMySkills); // Reusing getMySkills as it does the same logic

/* ===============================
   UPDATE SKILL
   PUT /api/skills/:id
================================ */
router.put("/:id", auth, updateSkill);

/* ===============================
   DELETE SKILL
   DELETE /api/skills/:id
================================ */
router.delete("/:id", auth, deleteSkill);

export default router;
