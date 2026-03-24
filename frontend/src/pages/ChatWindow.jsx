import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
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
  const [partner, setPartner] = useState(null);
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
      .then((res) => {
        setMessages(res.data.messages || []);
        setPartner(res.data.partner || null);
      })
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
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="h-[calc(100vh-88px)] w-full bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="flex flex-col w-full max-w-3xl bg-white border border-gray-200 shadow-md rounded-2xl h-full relative overflow-hidden">

        {/* HEADER */}
        {partner && (
          <header className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-white flex-shrink-0 z-10">
            {partner.avatar ? (
              <img
                src={partner.avatar.startsWith('http') ? partner.avatar : `http://localhost:8000${partner.avatar}`}
                alt="avatar"
                className="w-11 h-11 rounded-full object-cover"
              />
            ) : (
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-semibold uppercase text-lg">
                {(partner.name || partner.email)?.charAt(0)}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800 text-lg">
                {partner.name || partner.email}
              </span>
            </div>
          </header>
        )}

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-white relative no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-3 opacity-80">
              <p className="text-sm font-medium">No messages yet</p>
              <p className="text-xs">Start the conversation!</p>
            </div>
          )}
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
                  className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm text-sm
                    ${isMine
                      ? "bg-sky-500 text-white rounded-br-md"
                      : "bg-white text-gray-800 border border-gray-100 rounded-bl-md"
                    }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.text}</p>
                  <p className="text-[10px] mt-1 text-right opacity-70">
                    {formatTime(m.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} className="h-2" />
        </div>

        {/* INPUT */}
        <footer className="bg-white border-t border-gray-100 px-4 py-3 flex gap-2 flex-shrink-0 rounded-b-2xl sticky bottom-0">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Type a message…"
          />
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </footer>
      </div>
    </div>
  );
}
