import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
  sendRequest,
  getRequests,
  acceptRequest,
  rejectRequest,
} from "../controllers/trade.controller.js";

export default function tradeRoutes(io) {
  const router = express.Router();

  /* ================= SEND TRADE REQUEST ================= */
  router.post("/request", auth, (req, res) => sendRequest(req, res, io));

  /* ================= GET MY REQUESTS ================= */
  router.get("/requests", auth, getRequests);

  /* ================= ACCEPT REQUEST ================= */
  router.put("/requests/:id/accept", auth, (req, res) => acceptRequest(req, res, io));

  /* ================= REJECT REQUEST ================= */
  router.put("/requests/:id/reject", auth, (req, res) => rejectRequest(req, res, io));

  return router;
}
