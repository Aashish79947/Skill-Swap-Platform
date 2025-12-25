import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
  getConversations,
  getChatHistory,
  sendMessage,
} from "../controllers/chat.controller.js";

export default function chatRoutes(io) {
  const router = express.Router();

  /* ================================
     GET MY CONVERSATIONS (INBOX)
     GET /api/chat/conversations
  ================================= */
  router.get("/conversations", auth, getConversations);

  /* ================================
     GET CHAT HISTORY
     GET /api/chat/:tradeId
  ================================= */
  router.get("/:tradeId", auth, getChatHistory);

  /* ================================
     SEND MESSAGE (REAL-TIME)
     POST /api/chat/send
  ================================= */
  router.post("/send", auth, (req, res) => sendMessage(req, res, io));

  return router;
}
