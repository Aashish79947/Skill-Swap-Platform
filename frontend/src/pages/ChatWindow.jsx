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

  /* CURRENT USER */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const payload = JSON.parse(atob(token.split(".")[1]));
    setCurrentUserId(payload.id);
  }, []);

  /* LOAD CHAT */
  useEffect(() => {
    if (!tradeId) return;
    API.get(`/chat/${tradeId}`)
      .then((res) => setMessages(res.data || []))
      .catch(console.error);
  }, [tradeId]);

  /* SOCKET */
  useEffect(() => {
    if (!tradeId || !currentUserId) return;

    socket.connect();
    socket.emit("join_trade", tradeId);

    socket.on("receive_message", (msg) => {
      setMessages((prev) =>
        prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]
      );
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [tradeId, currentUserId]);

  /* AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      await API.post("/chat/send", { tradeId, text });
      setText("");
    } catch {
      alert("Failed to send message");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-3xl mx-auto">

      {/* HEADER */}
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <h2 className="font-semibold text-gray-900">Trade Chat</h2>
        <p className="text-xs text-gray-500">Trade #{tradeId}</p>
      </header>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 no-scrollbar">
        {messages.map((m) => {
          const senderId =
            typeof m.sender === "object" ? m.sender._id : m.sender;
          const isMine = senderId === currentUserId;

          return (
            <div
              key={m._id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl shadow text-sm
                  ${
                    isMine
                      ? "bg-sky-500 text-white rounded-br-md"
                      : "bg-white text-gray-800 border rounded-bl-md"
                  }`}
              >
                <p>{m.text}</p>
                <p className="text-[10px] mt-1 text-right opacity-70">
                  {formatTime(m.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <footer className="bg-white border-t px-4 py-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded-full px-4 py-2 focus:ring-2 focus:ring-sky-400"
          placeholder="Type a message…"
        />
        <button
          onClick={sendMessage}
          className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-full font-medium"
        >
          Send
        </button>
      </footer>
    </div>
  );
}
