export interface Thought {
  subject: string;
  description: string;
  timestamp: string;
}

export interface Chat {
  sessionId: string;
  projectHash: string;
  startTime: string;
  lastUpdated: string;
  messages: Message[];
  summary?: string;
}

export interface Message {
  id?: string;
  timestamp?: string;
  type: "user" | "gemini";
  content?: string;
  thoughts?: Thought[];
  model?: string;
  toolCalls?: any[];
  tokens?: {
    input: number;
    output: number;
    cached: number;
    thoughts: number;
    tool: number;
    total: number;
  };
}
