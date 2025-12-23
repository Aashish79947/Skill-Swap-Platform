import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../services/api";

const socket = io("http://localhost:8000", {
  autoConnect: false,
});

function formatTime(time) {
  if (!time) return "";
  return new Date(time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatWindow() {
  const { tradeId } = useParams();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  const bottomRef = useRef(null);

  /* ================================
     GET CURRENT USER ID (JWT)
  ================================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    setCurrentUserId(payload.id);
  }, []);

  /* ================================
     LOAD CHAT HISTORY
  ================================= */
  useEffect(() => {
    if (!tradeId) return;

    API.get(`/chat/${tradeId}`)
      .then((res) => setMessages(res.data || []))
      .catch((err) =>
        console.error("❌ Chat history load error:", err)
      );
  }, [tradeId]);

  /* ================================
     SOCKET.IO SETUP
  ================================= */
  useEffect(() => {
    if (!tradeId || !currentUserId) return;

    socket.connect();

    socket.emit("join_trade", tradeId);

    socket.on("receive_message", (msg) => {
      setMessages((prev) => {
        // prevent duplicates
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [tradeId, currentUserId]);

  /* ================================
     AUTO SCROLL
  ================================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================================
     SEND MESSAGE
  ================================= */
  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const res = await API.post("/chat/send", {
        tradeId,
        text,
      });

      // push immediately (NO waiting)
      //setMessages((prev) => [...prev, res.data]);
      setText("");
    } catch (err) {
      console.error("❌ Send message failed:", err);
      alert("Failed to send message");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* HEADER */}
      <header className="p-4 bg-white border-b">
        <h2 className="text-lg font-semibold">Trade Chat</h2>
        <p className="text-xs text-gray-500">Trade ID: {tradeId}</p>
      </header>

      {/* CHAT BODY */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => {
          const senderId =
            typeof m.sender === "object" ? m.sender._id : m.sender;

          const isMine = senderId === currentUserId;

          return (
            <div
              key={m._id}
              className={`flex ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-xs ${
                  isMine
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <p className="text-sm">{m.text}</p>
                <p className="text-[10px] mt-1 text-right opacity-70">
                  {formatTime(m.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* FOOTER */}
      <footer className="p-3 bg-white border-t flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded-full px-4 py-2"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-5 py-2 rounded-full"
        >
          Send
        </button>
      </footer>
    </div>
  );
}
