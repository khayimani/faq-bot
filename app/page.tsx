"use client";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{from:"user"|"bot",text:string}[]>([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: input }),
    });
    const data = await res.json();
    setMessages(m => [...m, { from: "user", text: input }, { from: "bot", text: data.answer }]);
    setInput("");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <div className="w-full max-w-md border rounded-lg p-4 h-96 overflow-y-auto bg-white shadow">
        {messages.map((m,i)=>(
          <div key={i} className={`my-2 ${m.from==="user"?"text-right":"text-left"}`}>
            <span className={`inline-block px-3 py-2 rounded-lg ${m.from==="user"?"bg-blue-500 text-white":"bg-gray-200"}`}>
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex w-full max-w-md mt-4">
        <input
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&sendMessage()}
          className="flex-1 border rounded-l px-3 py-2"
          placeholder="Ask a question..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 rounded-r">Send</button>
      </div>
    </div>
  );
}
