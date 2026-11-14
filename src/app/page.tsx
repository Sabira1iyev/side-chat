"use client"

import { Message } from "../types/types";
import { useState } from "react";



export default function Home() {

  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value)
  }

  const handleSendMessage = async () => {
    if (!userInput) return;
    const userMessage: Message = { role: "user", content: userInput }
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setUserInput("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages
        })
      })
      const data = await res.json();
      const assistantMessage: Message = { role: "assistant", content: data.reply }
      setMessages([...newMessages, assistantMessage]);
      setUserInput("")
    }
    catch (error) {
      console.log("Assistant Error", error);
    }
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900 px-6 py-4">
        <h1 className="text-lg font-semibold">Phoenix</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((msg, idx) => (
                                <div className={`animate_message py-2 px-5 my-1 rounded-[18px] w-max max-w-[80%] text-sm ${msg.role === "user" ? "bg-blue-600 text-white ml-auto shadow-sm" : "text-text shadow-sm"}`}
                                    key={idx}>
                                    <div className="space-y-4 font-medium max-w-full overflow-hidden wrap-break-word">
                                        {msg.content}
                                    </div>
                                </div>
                            ))}

          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-zinc-800 px-4 py-2 text-sm shadow-sm">
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-800 bg-zinc-900 px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <input
            type="text"
            onChange={handleChange}
            placeholder="Mesajınızı yazın..."
            className="flex-1 rounded-full border border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 px-4 py-2 text-sm outline-none focus:border-blue-500"
          />
          <button
            type="button"
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            onClick={handleSendMessage}
          >
            Gönder
          </button>
        </div>
      </footer>
    </div>
  );
}
