type Role = "user" | "assistant";

export interface Message {
  role: Role;
  content: string;
}


export interface Thread {
  id:string;
  messages: Message[];
  branch?: {
    parentThreadId: string;
    messageIndex: number;
    selectedText: string; 
  }
}