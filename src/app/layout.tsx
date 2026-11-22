import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
 


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Side Chat",
  description: "Generated Phoenix Web",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
