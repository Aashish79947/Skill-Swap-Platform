import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
  sendRequest,
  getRequests,
  acceptRequest,
  rejectRequest,
} from "../controllers/trade.controller.js";

const router = express.Router();

/* ================= SEND TRADE REQUEST ================= */
router.post("/request", auth, sendRequest);

/* ================= GET MY REQUESTS ================= */
router.get("/requests", auth, getRequests);

/* ================= ACCEPT REQUEST ================= */
router.put("/requests/:id/accept", auth, acceptRequest);

/* ================= REJECT REQUEST ================= */
router.put("/requests/:id/reject", auth, rejectRequest);

export default router;
