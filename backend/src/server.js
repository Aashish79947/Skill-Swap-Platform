import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import tradeRoutes from "./routes/trade.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import matchRoutes from "./routes/match.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import reviewRoutes from "./routes/review.routes.js";

dotenv.config();
connectDB();

// Configure passport after dotenv config
import passport, { configurePassport } from "./config/passport.js";
configurePassport();

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

/* =========================
   CREATE HTTP SERVER
========================= */
const server = http.createServer(app);

/* =========================
   SOCKET.IO INIT (MOVE UP!)
========================= */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

/* =========================
   SOCKET EVENTS
========================= */
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("join_trade", (tradeId) => {
    socket.join(tradeId);
    console.log(`📦 Joined trade room: ${tradeId}`);
  });

  socket.on("join_user", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`👤 User joined private room: user_${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

/* =========================
   ROUTES (AFTER io exists)
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/trade", tradeRoutes(io));
app.use("/api/chat", chatRoutes(io));
app.use("/api/matches", matchRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reviews", reviewRoutes);


app.get("/", (req, res) => {
  res.send("API running...");
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
