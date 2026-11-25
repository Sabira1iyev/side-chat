"use client"

import { Message } from "../types/type";
import { useEffect, useRef, useState } from "react";
import { Flame, Send, Square } from "lucide-react";
import "./globals.css";
import SideChatWindow from "../components/SideChatWindow";
import Markdown from "../components/ReactMarkdown";



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
  const [sideSelectedText, SideSetSelectedText] = useState("");
  const [mainMessageIndex, setMainMessageIndex] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    setIsThinking(true);


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
        const reply = data.reply || data.message || "Soryy, I couldn't get a response.";
        setMessages([...newMessages, { role: "assistant", content: reply }])
        return
      }

      const assistantMessage: Message = { role: "assistant", content: data.reply || "Sorry, I couldnt get a response." }
      setMessages([...newMessages, assistantMessage]);
      console.log(menu?.messageIndex);
    }
    catch (error) {
      console.log("Assistant Error", error);
      setMessages([...newMessages, { role: "assistant", content: "Connection error. Please try again." }])
    }
    finally {
      setIsThinking(false);
    }
  }

  useEffect(() => {
    const savedMessages = localStorage.getItem("phoenix-messages")

    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      }
      catch (error) {
        console.log("Local storage error:", error);
      }
    }
    setIsLoaded(true)
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("phoenix-messages", JSON.stringify(messages));
  }, [messages, isLoaded])

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

    <div className="flex h-screen flex-col bg-zinc-900 text-zinc-100">
      <header className="flex items-center gap-2 border-b border-orange-500/30 px-6 py-4 shadow-[0_1px_20px_rgba(249,115,22,0.25)]">
        <Flame size={22} className="text-orange-500" fill="currentColor" />
        <h1 className="phoenix-text text-lg font-bold tracking-wide">PHOENIX AI</h1>
      </header>
      <div className="flex min-h-0 flex-1">
        <div className="relative flex min-w-0 flex-1 flex-col">

          <main className="flex-1 overflow-y-auto px-4 py-6 scrollbar-none">
            <div className="mx-auto flex max-w-2xl flex-col gap-4">
              {messages.map((msg, idx) => (
                <div className={`animate_message py-2 px-5 my-1 rounded-[18px] w-max max-w-[80%] text-sm ${msg.role === "user" ? "phoenix-gradient text-white ml-auto shadow-sm" : "bg-zinc-800 border border-zinc-700 text-zinc-100 shadow-sm"}`}
                  key={idx}
                  onContextMenu={(e) => handleContextMenu(e, idx)}
                >
                  <div className="space-y-4 py-1 font-medium max-w-full overflow-hidden wrap-break-word">
                    {msg.role === "assistant" ?
                      <Markdown>{msg.content}</Markdown>
                      :
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    }
                  </div>
                </div>
              ))}
              {
                isThinking && (
                  <div className="flex justify-start">
                    <div className="border border-orange-500/30 text-orange-300 rounded-2xl px-4 py-2 text-sm max-w-[80%] rounded-tl-none animate-pulse">
                      Phoenix is rising...
                    </div>
                  </div>
                )
              }
              <div ref={messageRef} />
            </div>
            {menu && (
              <div className="fixed z-50" style={{ left: menu.x, top: menu.y }}
                ref={sideButtonRef}
              >
                <button
                  type="button"
                  className="rounded-md border border-orange-500/40 bg-zinc-800 px-3 py-2 text-sm text-orange-100 shadow-lg hover:bg-orange-500/20"
                  onClick={() => {

                    SideSetSelectedText(menu.text);
                    setMainMessageIndex(menu.messageIndex);
                    setSideChatOpen(true)
                    setMenu(null);
                  }}

                >
                  Ask about this
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
                placeholder="Ask Phoenix anything..."
                className="max-h-50 min-h-10 flex-1 resize-none overflow-y-auto bg-transparent px-3 py-2.5 text-sm leading-5 text-zinc-100 outline-none placeholder:text-zinc-500 scrollbar-none"
              />
              {isThinking ?
                <button
                  type="submit"
                  className="phoenix-gradient rounded-full p-3 text-sm font-medium text-white"
                >

                  <Square size={16} strokeWidth={3} fill="currentColor" className="rounded-full" />

                </button>
                 :
                <button
                  type="submit"
                  className="phoenix-gradient rounded-full px-7 py-2 text-sm font-medium text-white"
                >
                  <Send size={15} className="cursor-pointer" />

                </button>

              }

            </div>
          </form>
        </div>
        {sideChatOpen && (
          <SideChatWindow

            onClose={() => setSideChatOpen(false)}
            sideSelectedText={sideSelectedText}
            mainMessages={messages}
            messageIndex={mainMessageIndex}
          />
        )
        }
      </div>
    </div>
  );
}

