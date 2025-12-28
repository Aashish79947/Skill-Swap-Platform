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
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <h1 className="text-3xl font-semibold text-gray-900 text-center mb-8">
        Messages
      </h1>

      {conversations.length === 0 ? (
        <p className="text-center text-gray-500">
          No conversations yet.
        </p>
      ) : (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {conversations.map((c, index) => (
            <div
              key={c.conversation_key}
              onClick={() =>
                navigate(`/messages/${c.conversation_key}`)
              }
              className={`flex items-center gap-4 px-5 py-4 cursor-pointer transition
                hover:bg-gray-50 ${index !== conversations.length - 1
                  ? "border-b border-gray-200"
                  : ""
                }`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-semibold uppercase">
                {c.partner_email?.charAt(0)}
              </div>

              {/* Message content */}
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-900 truncate">
                    {c.partner_email} <span className="text-gray-500 font-normal">({c.skill_title})</span>
                  </p>

                  <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                    {new Date(c.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <p className="text-sm text-gray-600 truncate mt-0.5">
                  {c.latest_message || "No messages yet"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
