import React from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

export default function NotificationDropdown({ onClose }) {
    const { notifications, markAsRead, markAllRead } = useNotifications();
    const navigate = useNavigate();

    const handleNotificationClick = async (n) => {
        if (!n.isRead) {
            await markAsRead(n._id);
        }
        onClose();
        navigate(n.link);
    };

    return (
        <div className="absolute right-0 mt-2 w-80 glass border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-white/20 flex justify-between items-center bg-white/10">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <button
                    onClick={markAllRead}
                    className="text-xs text-sky-600 hover:text-sky-700 font-medium transition"
                >
                    Mark all read
                </button>
            </div>

            <div className="max-h-96 overflow-y-auto no-scrollbar">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        No notifications yet
                    </div>
                ) : (
                    notifications.map((n) => (
                        <div
                            key={n._id}
                            onClick={() => handleNotificationClick(n)}
                            className={`p-4 border-b border-white/10 cursor-pointer transition flex flex-col gap-1 
                                ${n.isRead ? 'bg-transparent hover:bg-white/10' : 'bg-white/30 hover:bg-white/40'}`}
                        >
                            <div className="flex justify-between items-start">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium 
                                    ${n.type === 'new_message' ? 'bg-green-100 text-green-700' : 'bg-sky-100 text-sky-700'}`}>
                                    {n.type.replace('_', ' ').toUpperCase()}
                                </span>
                                <span className="text-[10px] text-gray-500">
                                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className={`text-sm ${n.isRead ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                                {n.message}
                            </p>
                        </div>
                    ))
                )}
            </div>

            <div className="p-3 text-center bg-white/10 border-t border-white/20">
                <button
                    onClick={onClose}
                    className="text-xs text-gray-600 hover:text-gray-800 transition"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
