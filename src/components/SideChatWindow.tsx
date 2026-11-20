"use client"

import { Message } from "../types/type"
import { useState, useEffect } from "react"
import { Send } from "lucide-react"



export default function SideChatWindow() {

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
        }
        catch(error){
            console.log("Side chat error: ", error);
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
        </div>
    )
}