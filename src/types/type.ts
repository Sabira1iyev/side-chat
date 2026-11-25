type Role = "user" | "assistant";

export interface Message {
  role: Role;
  content: string;
}

export interface Thread {
  id: string;
  messages: Message[];
  branch?: {
    parentThreadId: string;
    messageIndex: number;
    selectedText: string;
  };
}

export interface Chat {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
  threads: Thread[];
}
