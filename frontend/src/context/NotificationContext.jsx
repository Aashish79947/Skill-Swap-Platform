import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "../services/api";
import toast from "react-hot-toast";

const NotificationContext = createContext(null);

const socket = io("http://localhost:8000", {
    autoConnect: false,
});

export const NotificationProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (token && user) {
            // Fetch initial notifications
            fetchNotifications();

            // Connect socket and join private room
            socket.connect();
            socket.emit("join_user", user.id);

            socket.on("new_notification", (notification) => {
                setNotifications((prev) => [notification, ...prev]);
                setUnreadCount((prev) => prev + 1);
                toast.success(notification.message, {
                    icon: "🔔",
                    duration: 4000,
                });
            });

            return () => {
                socket.off("new_notification");
                socket.disconnect();
            };
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [token, user]);

    const fetchNotifications = async () => {
        try {
            const res = await getNotifications();
            setNotifications(res.data);
            setUnreadCount(res.data.filter((n) => !n.isRead).length);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        }
    };

    const markAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    const markAllRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                markAsRead,
                markAllRead,
                fetchNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
