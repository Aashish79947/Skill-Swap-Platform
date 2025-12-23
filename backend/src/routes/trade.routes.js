import express from "express";
import TradeRequest from "../models/tradeRequest.js";
import Skill from "../models/skill.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

/* ================= SEND TRADE REQUEST ================= */
router.post("/request", auth, async (req, res) => {
  const { skillId } = req.body;

  if (!skillId) {
    return res.status(400).json({ message: "Skill ID is required" });
  }

  const skill = await Skill.findById(skillId);
  if (!skill) {
    return res.status(404).json({ message: "Skill not found" });
  }

  // ❌ cannot trade with yourself
  if (skill.user.toString() === req.user.id) {
    return res.status(400).json({ message: "You cannot trade with yourself" });
  }

  const existing = await TradeRequest.findOne({
    sender: req.user.id,
    receiver: skill.user,
    skill: skillId,
    status: "pending",
  });

  if (existing) {
    return res.status(400).json({ message: "Request already sent" });
  }

  const request = await TradeRequest.create({
    sender: req.user.id,
    receiver: skill.user,
    skill: skillId,
  });

  res.status(201).json(request);
});

/* ================= GET MY REQUESTS ================= */
router.get("/requests", auth, async (req, res) => {
  const userId = req.user.id;

  const sent = await TradeRequest.find({ sender: userId })
    .populate("receiver", "email")
    .populate("skill", "title category");

  const received = await TradeRequest.find({ receiver: userId })
    .populate("sender", "email")
    .populate("skill", "title category");

  res.json({ sent, received });
});

/* ================= ACCEPT REQUEST ================= */
router.put("/requests/:id/accept", auth, async (req, res) => {
  const request = await TradeRequest.findById(req.params.id);

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  if (request.receiver.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  request.status = "accepted";
  await request.save();

  res.json({ message: "Trade accepted" });
});

/* ================= REJECT REQUEST ================= */
router.put("/requests/:id/reject", auth, async (req, res) => {
  const request = await TradeRequest.findById(req.params.id);

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  if (request.receiver.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  request.status = "rejected";
  await request.save();

  res.json({ message: "Trade rejected" });
});

export default router;
