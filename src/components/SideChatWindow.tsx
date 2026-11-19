"use client"

import { useState, useEffect } from "react"


export default function SideChatWindow() {
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