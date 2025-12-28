import Notification from "../models/notification.js";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch notifications" });
    }
};

export const markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ message: "Notification marked as read" });
    } catch (err) {
        res.status(500).json({ message: "Failed to update notification" });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ user: req.user.id, isRead: false }, { isRead: true });
        res.json({ message: "All notifications marked as read" });
    } catch (err) {
        res.status(500).json({ message: "Failed to update notifications" });
    }
};

export const clearNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ user: req.user.id });
        res.json({ message: "All notifications cleared" });
    } catch (err) {
        res.status(500).json({ message: "Failed to clear notifications" });
    }
};

