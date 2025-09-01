"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState<
    { from: "user" | "bot"; text: string }[]
  >([
    { from: "bot", text: "Hi! I'm your AI assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Detect system dark mode preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message handler
  async function sendMessage() {
    if (!input.trim()) return;
    const userMsg: { from: "user"; text: string } = { from: "user", text: input };
setMessages((m) => [...m, userMsg]);
    setInput("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();
      const botMsg: { from: "bot"; text: string } = { from: "bot", text: data.answer || "I couldn't understand that." };
setMessages((m) => [...m, botMsg]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessages((m) => [
        ...m,
        { from: "bot", text: "Oops! Something went wrong. Please try again." },
      ]);
    }
  }

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100"
          : "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800"
      }`}
    >
      <div
        className={`w-full max-w-xl flex flex-col bg-opacity-80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border transition-all duration-300 ${
          darkMode
            ? "bg-gray-800/90 border-gray-700 shadow-gray-900/30"
            : "bg-white/90 border-gray-200 shadow-gray-200/60"
        }`}
      >
        {/* Header */}
       <header
  className={`flex items-center gap-3 px-5 py-4 bg-opacity-70 border-b transition-colors duration-300 backdrop-blur-sm ${
    darkMode ? "bg-gray-900/50 border-gray-700" : "bg-blue-50/70 border-gray-200"
  }`}
>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            🤖
          </div>
          <div>
            <h1 className="font-semibold text-sm md:text-base">AI Assistant</h1>
            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Always here to help
            </p>
          </div>
        </header>

        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 h-96 md:h-[32rem] scroll-smooth">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 animate-fade-in-up ${
                msg.from === "user" ? "justify-end" : "justify-start"
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {msg.from === "bot" && (
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs shadow-sm">
                    🤖
                  </div>
                </div>
              )}

              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.from === "user"
                    ? darkMode
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-none"
                    : darkMode
                    ? "bg-gray-700 text-gray-100 rounded-tl-none"
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>

              {msg.from === "user" && (
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs shadow-sm">
                    👤
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} className="pb-1" />
        </div>

        {/* Input Bar */}
        <div
          className={`flex border-t px-3 py-3 gap-2 transition-colors duration-300 ${
            darkMode ? "bg-gray-800/70 border-gray-700" : "bg-white/70 border-gray-200"
          }`}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask me anything..."
            className={`flex-1 px-4 py-2 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 text-sm placeholder-gray-500
              ${
                darkMode
                  ? "bg-gray-700 border-gray-600 focus:ring-blue-500 text-gray-100 placeholder-gray-400"
                  : "bg-white border-gray-300 focus:ring-blue-400 text-gray-800"
              }
              hover:border-blue-300 dark:hover:border-blue-600`}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className={`px-5 py-2 rounded-xl font-medium text-sm transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
              }`}
          >
            Send
          </button>
        </div>
      </div>

      {/* Optional: Add subtle watermark or branding */}
      <p className={`text-xs mt-4 opacity-60 ${darkMode ? "text-gray-500" : "text-gray-600"}`}>
        Powered by AI • Fast • Secure
      </p>
    </div>
  );
}