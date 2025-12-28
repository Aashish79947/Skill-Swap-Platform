import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    clearNotifications,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", auth, getNotifications);
router.put("/:id/read", auth, markAsRead);
router.put("/read-all", auth, markAllAsRead);
router.delete("/", auth, clearNotifications);

export default router;
