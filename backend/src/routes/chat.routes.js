import express from "express";
import auth from "../middleware/auth.middleware.js";
import Message from "../models/message.js";
import TradeRequest from "../models/tradeRequest.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export default function chatRoutes(io) {
  const router = express.Router();

  /* ================================
     GET MY CONVERSATIONS (INBOX)
     GET /api/chat/conversations
  ================================= */
  router.get("/conversations", auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$trade",
          latest_message: { $first: "$text" },
          timestamp: { $first: "$createdAt" },
          sender: { $first: "$sender" },
          receiver: { $first: "$receiver" },
        },
      },
      {
        $addFields: {
          partner_id: {
            $cond: [
              { $eq: ["$sender", userId] },
              "$receiver",
              "$sender",
            ],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "partner_id",
          foreignField: "_id",
          as: "partner",
        },
      },
      { $unwind: "$partner" },
      {
        $project: {
          conversation_key: "$_id",
          latest_message: 1,
          timestamp: 1,
          partner_email: "$partner.email",
        },
      },
    ]);

    res.json({ conversations });
  } catch (err) {
    console.error("Conversation load error:", err);
    res.status(500).json({ message: "Failed to load conversations" });
  }
});

  /* ================================
     GET CHAT HISTORY
     GET /api/chat/:tradeId
  ================================= */
  router.get("/:tradeId", auth, async (req, res) => {
    try {
      const { tradeId } = req.params;

      const trade = await TradeRequest.findById(tradeId);
      if (!trade || trade.status !== "accepted") {
        return res.status(403).json({ message: "Invalid trade" });
      }

      const messages = await Message.find({ trade: tradeId })
        .populate("sender", "email")
        .sort({ createdAt: 1 });

      res.json(messages);
    } catch (err) {
      res.status(500).json({ message: "Failed to load chat" });
    }
  });

  /* ================================
     SEND MESSAGE (REAL-TIME)
     POST /api/chat/send
  ================================= */
  router.post("/send", auth, async (req, res) => {
    try {
      const { tradeId, text } = req.body;

      const trade = await TradeRequest.findById(tradeId);
      if (!trade || trade.status !== "accepted") {
        return res.status(403).json({ message: "Invalid trade" });
      }

      const receiver =
        trade.sender.toString() === req.user.id
          ? trade.receiver
          : trade.sender;

      const message = await Message.create({
        trade: tradeId,
        sender: req.user.id,
        receiver,
        text,
      });

      const populated = await message.populate("sender", "email");

      io.to(tradeId).emit("receive_message", populated);

      res.status(201).json(populated);
    } catch (err) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  return router;
}
