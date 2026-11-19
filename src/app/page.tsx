"use client"

import { Message } from "../types/type";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import "./globals.css";
import SideChatWindow from "../components/SideChatWindow";




export default function Home() {

  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [menu, setMenu] = useState<{
    x: number,
    y: number;
    text: string;
    messageIndex: number;
  } | null>(null);
  const [sideChatOpen, setSideChatOpen] = useState(false);
  const sideButtonRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    setUserInput(textarea.value);
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }

  const handleSendMessage = async () => {
    if (!userInput) return;
    const userMessage: Message = { role: "user", content: userInput }
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setUserInput("");
    const textarea = document.querySelector<HTMLTextAreaElement>("#message-input");


    if (textarea) textarea.style.height = "auto";
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
      if (!res.ok) {
        console.log("Error: ", data.message)
      }

      const assistantMessage: Message = { role: "assistant", content: data.reply }
      setMessages([...newMessages, assistantMessage]);


    }
    catch (error) {
      console.log("Assistant Error", error);
    }
  }

  const handleContextMenu = (e: React.MouseEvent, index: number) => {
    const text = window.getSelection()?.toString().trim();
    if (!text) return;
    e.preventDefault();
    setMenu({
      x: e.clientX,
      y: e.clientY,
      text,
      messageIndex: index,
    });
  }

  useEffect(() => {
    const clickOutside = (event: MouseEvent) => {
      const click = sideButtonRef.current?.contains(event.target as Node);
      if (!click) {
        setMenu(null);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => {
      document.removeEventListener("mousedown", clickOutside)
    }
  }, [menu]);


  return (

    <div className="relative flex h-screen flex-col bg-zinc-900 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950 px-6 py-4">
        <h1 className="text-lg font-semibold">Phoenix</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((msg, idx) => (
            <div className={`animate_message py-2 px-5 my-1 rounded-[18px] w-max max-w-[80%] text-sm ${msg.role === "user" ? "bg-blue-600 text-white ml-auto shadow-sm" : "text-text shadow-sm"}`}
              key={idx}
              onContextMenu={(e) => handleContextMenu(e, idx)}
            >
              <div className="space-y-4 font-medium max-w-full overflow-hidden wrap-break-word">
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        {menu && (
          <div className="fixed z-50" style={{ left: menu.x, top: menu.y }}
            ref={sideButtonRef}
          >
            <button
              type="button"
              className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 shadow-lg hover:bg-zinc-700"
              onClick={() => {
                setSideChatOpen(true)
                setMenu(null);
              }}

            >
              bunu ayrica ogren
            </button>
          </div>
        )}
      </main>


      <form className={`w-full px-4 py-4 ${messages.length === 0 ? "absolute left-0 top-1/2 -translate-y-1/2" : "mt-auto"
        }`}
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <div className={`mx-auto flex max-w-2xl gap-2 rounded-3xl border border-zinc-700 bg-zinc-800 p-2 ${userInput.length === 0 ? "items-center" : "items-end"
          }`}>
          <textarea
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
            id="message-input"
            rows={1}
            value={userInput}
            onChange={handleChange}
            placeholder="Enter your message"
            className="max-h-50 min-h-10 flex-1 resize-none overflow-y-auto bg-transparent px-3 py-2.5 text-sm leading-5 text-zinc-100 outline-none placeholder:text-zinc-500 scrollbar-none"
          />
          <button
            type="submit"
            className="rounded-full bg-blue-600 px-7 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Send size={15} className="cursor-pointer" />
          </button>
        </div>
      </form>
      {
        sideChatOpen && (
          <SideChatWindow />
        )
      }
    </div>
  );
}
