"use client";
import { useState } from "react";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ role: string; text: string }[]>([]);

  async function sendMessage() {
    if (!message.trim()) return;

    // Add user message
    setChat([...chat, { role: "user", text: message }]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();

    // Add bot reply
    setChat((prev) => [...prev, { role: "assistant", text: data.reply }]);
    setMessage("");
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      {/* Header */}
      <div className="bg-white shadow-md p-4 text-center font-bold text-xl text-gray-700">
        My GPT Chat 💬
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl shadow-md ${
                msg.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="bg-white p-4 flex items-center gap-2 shadow-md">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

