import express from "express";
import Skill from "../models/skill.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

/* ===============================
   CREATE SKILL
   POST /api/skills
================================ */
router.post("/", auth, async (req, res) => {
  const { title, description, category } = req.body;

  if (!category) {
    return res.status(400).json({ message: "Category is required" });
  }

  const skill = await Skill.create({
    title,
    description,
    category,
    user: req.user.id,
  });

  res.status(201).json(skill);
});

/* ===============================
   GET MY SKILLS (PROFILE)
   GET /api/skills/my
================================ */
router.get("/my", auth, async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user.id });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch skills" });
  }
});

/* ===============================
   MARKETPLACE (OTHER USERS)
   GET /api/skills/marketplace
================================ */
router.get("/marketplace", auth, async (req, res) => {
  const skills = await Skill.find({
    user: { $ne: req.user.id },
  }).populate("user", "name email");

  res.json(skills);
});

/* ===============================
   GET MY SKILLS (DASHBOARD)
   GET /api/skills
   (optional, but safe to keep)
================================ */
router.get("/", auth, async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user.id });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch skills" });
  }
});

/* ===============================
   UPDATE SKILL
   PUT /api/skills/:id
================================ */
router.put("/:id", auth, async (req, res) => {
  const { title, description, category } = req.body;

  const skill = await Skill.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { title, description, category },
    { new: true }
  );

  if (!skill) {
    return res.status(404).json({ message: "Skill not found" });
  }

  res.json(skill);
});

/* ===============================
   DELETE SKILL
   DELETE /api/skills/:id
================================ */
router.delete("/:id", auth, async (req, res) => {
  try {
    await Skill.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    res.json({ message: "Skill removed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete skill" });
  }
});

export default router;
