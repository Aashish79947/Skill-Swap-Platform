import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function MessagesList() {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const res = await API.get("/chat/conversations");
        setConversations(res.data.conversations || []);
      } catch (err) {
        console.error("Error loading conversations:", err);
      }
    };

    loadConversations();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Messages</h1>

      {conversations.length === 0 ? (
        <p className="text-center text-gray-500">
          No conversations yet.
        </p>
      ) : (
        <div className="space-y-3 max-w-2xl mx-auto">
          {conversations.map((c) => (
            <div
              key={c.conversation_key}
              onClick={() =>
                navigate(`/messages/${c.conversation_key}`)
              }
              className="bg-white p-4 rounded-xl border cursor-pointer hover:bg-gray-100"
            >
              <p className="font-semibold">@{c.partner_email}</p>
              <p className="text-sm text-gray-600 truncate">
                {c.latest_message}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(c.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
