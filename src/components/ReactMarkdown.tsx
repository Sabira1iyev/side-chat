"use client"

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";

interface MarkDownProps {
    children: string;
}

export default function Markdown({ children }: MarkDownProps) {
    return (
        <div
            className="prose prose-invert prose-sm max-w-none"
        >
            <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}
            >
                {children}
            </ReactMarkdown>
        </div>
    )
}