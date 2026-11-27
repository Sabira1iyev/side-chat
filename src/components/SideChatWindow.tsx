"use client"

import { Message } from "../types/type"
import { useState, useEffect, useRef } from "react"
import { X, Send } from "lucide-react";
import "@/src/app/globals.css"
import Markdown from "./ReactMarkdown";

interface SideChatWindowProp {
    onClose: () => void;
    sideSelectedText: string;
    mainMessages: Message[];
    messageIndex: number;
}


export default function SideChatWindow({ onClose, sideSelectedText, mainMessages, messageIndex }: SideChatWindowProp) {

    const [sideChatMessages, setSideChateMessages] = useState<Message[]>([]);
    const [sideChatUserInput, setSideChatUserInput] = useState(sideSelectedText);
    const [isSideAssistantThinking, setIsSideAssistantThinking] = useState(false);
    const messageRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        messageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [sideChatMessages]);

    const handleSendSideChatMessage = async () => {
        if (!sideChatUserInput) {
            return;
        }


        const userMessages: Message = { role: "user", content: sideChatUserInput };
        const newSideChatMessages = [...sideChatMessages, userMessages];
        setSideChateMessages(newSideChatMessages);
        setIsSideAssistantThinking(true);
        setSideChatUserInput("");
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }


        const transcript = mainMessages
            .slice(0, messageIndex + 1)
            .map((message) =>
                `${message.role === "user" ? "User" : "Assistant"} : ${message.content}`
            )
            .join("\n\n");

        const system =
            `The user is reading a conversation with an AI and did not understand this part :${sideSelectedText}
            
            Here is the conversation so far: ${transcript}

            Answer the user's side question this conversation as context. Refer to its examples when helpful, and keep the answer focused.
            `;
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        messages: newSideChatMessages,
                        system,
                    }
                )
            })
            const data = await res.json();
            const sideChatReply = data.reply || data.message || "Sorry, I couldn't get a response."
            setSideChateMessages([...newSideChatMessages, { role: "assistant", content: sideChatReply }]);
            return;
        }
        catch (error) {
            console.log("Side chat error: ", error);
            setSideChateMessages([...newSideChatMessages, { role: "assistant", content: "Connection error. Please try again." }])
        }
        finally {
            setIsSideAssistantThinking(false);
        }
    }

    const handleSideChatChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSideChatUserInput(e.target.value);
        const textarea = e.currentTarget;
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }

    useEffect(() => {
        setSideChatUserInput(sideSelectedText);
    }, [sideSelectedText])



    return (

        <aside className="animate-modal fixed inset-x-3 bottom-4 top-24 z-40 flex flex-col overflow-hidden rounded-[24px] border border-orange-500/20 bg-zinc-900/80 md:relative md:inset-auto md:z-auto md:mr-4 md:h-[80vh] md:w-[26rem] md:shrink-0 md:self-center md:rounded-[28px] md:bg-zinc-900/70 lg:w-200 shadow-[0_20px_60px_rgba(0,0,0,0.5)] ring-1 ring-black/20 backdrop-blur-2xl backdrop-saturate-150">
            <div className="flex-1 overflow-y-auto w-full px-2 pt-14 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {
                    sideChatMessages.map((msg, index) => (
                        <div className={`animate_message py-3 px-4 sm:px-5 my-1 mt-5 rounded-[20px] w-max max-w-[90%] sm:max-w-[80%] text-sm ${msg.role === "user" ? "phoenix-gradient text-white ml-auto" : "bg-white/10 text-zinc-100"}`}
                            key={index}

                        >
                            <div className="space-y-4 font-medium max-w-full overflow-hidden wrap-break-word">
                                <Markdown>{msg.content}</Markdown>
                            </div>
                        </div>
                    ))}
                {
                    isSideAssistantThinking && (
                        <div className="flex justify-start">
                            <div className="border border-orange-500/30 text-orange-300 rounded-2xl px-4 py-2 text-sm max-w-[80%] rounded-tl-none animate-pulse">
                                Phoenix is rising...
                            </div>
                        </div>
                    )}
                <div ref={messageRef} />


            </div>
            <form onSubmit={(e) => {
                e.preventDefault(),
                    handleSendSideChatMessage();
            }}
                className={`w-full px-4 py-4 ${sideChatMessages.length === 0 ? "absolute left-0 top-1/2 -translate-y-1/2" : "mt-auto"
                    }`}
            >
                <div className={`mx-auto flex max-w-2xl gap-2 rounded-3xl border border-white/10 bg-white/5 p-1.5 backdrop-blur transition focus-within:border-white/20 focus-within:bg-white/10 ${sideChatUserInput.length === 0 ? "items-center" : "items-end"
                    }`}>
                    <textarea
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                e.currentTarget.form?.requestSubmit();
                            }
                        }}
                        id="side-message-input"
                        rows={1}
                        value={sideChatUserInput}
                        ref={textareaRef}
                        onChange={handleSideChatChangeMessage}
                        placeholder="Ask Phoenix a follow-up..."
                        className="max-h-50 min-h-10 flex-1 resize-none overflow-y-auto bg-transparent px-3 py-2.5 text-base sm:text-sm leading-5 text-zinc-100 outline-none placeholder:text-zinc-500 scrollbar-none"
                    />
                    <button
                        type="submit"
                        className="phoenix-gradient rounded-full px-4 py-2 text-sm font-medium text-white transition active:scale-95"
                    >
                        <Send size={15} className="cursor-pointer" />
                    </button>
                </div>
            </form>



            <button
                onClick={onClose}
                className="absolute top-3 right-3 z-50 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/10 text-zinc-300 backdrop-blur transition hover:bg-white/20 hover:text-white"
            >
                <X size={16} />

            </button>
        </aside>

    )
}

