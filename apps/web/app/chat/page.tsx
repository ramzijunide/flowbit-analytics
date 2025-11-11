"use client";

import { useState } from "react";
import axios from "axios";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastSQL, setLastSQL] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<any[] | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_VANNA_API_BASE}/chat-with-data`,
        { message: input }
      );

      setMessages([
        ...newMessages,
        { role: "assistant", content: res.data.reply || "No response from AI" },
      ]);

      setLastSQL(res.data.sql || null);
      setLastResult(res.data.result || null);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "⚠️ Could not connect to AI backend." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 bg-gray-100 min-h-screen text-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
        <span role="img" aria-label="chat">💬</span>
        Chat with Data (AI-Powered)
      </h1>

      {/* Chat Messages */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 max-w-4xl mb-6">
        <div className="h-96 overflow-y-auto mb-4 border-b border-gray-300 pb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`my-2 ${msg.role === "user" ? "text-right" : "text-left"}`}
            >
              <span
                className={`inline-block px-3 py-2 rounded-xl ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.content}
              </span>
            </div>
          ))}

          {loading && (
            <div className="text-left text-gray-500 italic mt-2">Analyzing data...</div>
          )}
        </div>

        {/* Input Box */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask about your data (e.g., show processed invoices)"
            className="flex-grow p-3 border border-gray-300 rounded-xl"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>

      {/* 🧠 Show LLM-generated SQL */}
      {lastSQL && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 max-w-4xl mb-6">
          <h2 className="text-lg font-semibold text-indigo-700 mb-2">
            🧠 Generated SQL:
          </h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm text-gray-800">
            {lastSQL}
          </pre>
        </div>
      )}

      {/* 📊 Show Query Result */}
      {lastResult && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 max-w-4xl">
          <h2 className="text-lg font-semibold text-indigo-700 mb-2">📊 Query Result:</h2>
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                {Object.keys(lastResult[0]).map((key) => (
                  <th key={key} className="border border-gray-300 p-2">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lastResult.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="border border-gray-300 p-2 text-gray-700">
                      {String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
