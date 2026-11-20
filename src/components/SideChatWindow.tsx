"use client"

import { Message } from "../types/type"
import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown";
import { MessageCircle, X } from "lucide-react";


interface SideChatWindowProp {
    onClose: () => void;
}


export default function SideChatWindow({ onClose }: SideChatWindowProp) {

    const [sideChatMessages, setSideChateMessages] = useState<Message[]>([]);
    const [sideChatUserInput, setSideChatUserInput] = useState("");

    const handleSendSideChatMessage = async () => {
        if (!sideChatUserInput) {
            return;
        }
        const userMessages: Message = { role: "user", content: sideChatUserInput };
        const newSideChatMessages = [...sideChatMessages, userMessages];
        setSideChateMessages(newSideChatMessages);
        setSideChatUserInput("");

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        messages: newSideChatMessages
                    }
                )
            })
            const data = await res.json();
            const sideChatReply = data.reply || data.message || "Sorry, I couldn't get a response."
            setSideChateMessages([...newSideChatMessages, { role: "assistant", content: sideChatReply }]);
        }
        catch (error) {
            console.log("Side chat error: ", error);
            setSideChateMessages([...newSideChatMessages, { role: "assistant", content: "⚠️ Connection error. Please try again." }])
        }
    }

    return (

        <div className="fixed flex flex-col bottom-33 right-4 w-87.5 h-100 bg-bg2 border border-border rounded-xl shadow-2xl">
            <div className="flex-1 overflow-y-auto w-full my-2">
                <div className="p-2 my-1 rounded-lg max-w-[80%] text-sm">
                    <div className="space-y-4 font-medium max-w-full overflow-hidden wrap-break-word">

                    </div>
                </div>
            </div>
            <button
                onClick={onClose}
                className="fixed top-18 right-6 z-50 w-14 h-14 bg-blue-600 flex items-center justify-center rounded-full"
            >
                {<X size={24} />}

            </button>
        </div>

    )
}