import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
  getConversations,
  getChatHistory,
  sendMessage,
} from "../controllers/chat.controller.js";

export default function chatRoutes(io) {
  const router = express.Router();


  router.get("/conversations", auth, getConversations);

  router.get("/:tradeId", auth, getChatHistory);

  router.post("/send", auth, (req, res) => sendMessage(req, res, io));

  return router;
}
