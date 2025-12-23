import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import API from "../services/api";

const SOCKET_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const ChatPage = ({ currentUser }) => {
  const { requestId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [receiverId, setReceiverId] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");

  /* AUTO SCROLL */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* SOCKET SETUP */
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("register", { token });
    });

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("message_sent", (msg) => {
      setMessages((prev) =>
        prev.find((m) => m.id === msg.id) ? prev : [...prev, msg]
      );
    });

    return () => socket.disconnect();
  }, [token]);

  /* LOAD CHAT */
  useEffect(() => {
    const loadChat = async () => {
      try {
        const res = await API.get(`/chat/${requestId}`);
        const data = Array.isArray(res.data) ? res.data : [];
        setMessages(data);

        const firstMsg = data.find(
          (m) => m.sender_id !== currentUser?.id
        );
        if (firstMsg) setReceiverId(firstMsg.sender_id);
      } catch (err) {
        console.error("Chat load error:", err);
      }
    };
    if (requestId) loadChat();
  }, [requestId, currentUser]);

  /* SEND MESSAGE */
  const handleSend = () => {
    if (!input.trim()) return;
    if (!receiverId) return;

    socketRef.current.emit("send_message", {
      token,
      receiver_id: receiverId,
      request_id: Number(requestId),
      message: input.trim(),
    });

    setInput("");
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-gray-50">

      {/* HEADER */}
      <header className="sticky top-0 bg-white border-b px-6 py-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Trade Chat
        </h2>
        <p className="text-xs text-gray-500">
          Request #{requestId}
        </p>
      </header>

      {/* CHAT BODY */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 no-scrollbar">
        {messages.map((m) => {
          const isMine = m.sender_id === currentUser?.id;

          return (
            <div
              key={m.id || Math.random()}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl text-sm shadow
                  ${
                    isMine
                      ? "bg-sky-500 text-white rounded-br-md"
                      : "bg-white text-gray-800 rounded-bl-md border"
                  }`}
              >
                <p>{m.message}</p>
                <p className="text-[10px] mt-1 text-right opacity-70">
                  {new Date(
                    m.timestamp || Date.now()
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t px-4 py-3 flex gap-2 items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message…"
          className="flex-1 border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-sky-400"
        />
        <button
          onClick={handleSend}
          className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-full font-medium transition"
        >
          Send
        </button>
      </footer>
    </div>
  );
};

export default ChatPage;
