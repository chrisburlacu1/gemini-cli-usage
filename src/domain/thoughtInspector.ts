import { Chat, Thought } from "./types.js";

export type ThoughtEntry = {
  sessionId: string;
  messageId?: string | undefined;
  model?: string | undefined;
  thoughts: Thought[];
};

export class ThoughtInspector {
  public inspect(chats: Chat[]): ThoughtEntry[] {
    const entries: ThoughtEntry[] = [];

    for (const chat of chats) {
      for (const message of chat.messages) {
        if (
          message.type === "gemini" &&
          message.thoughts &&
          message.thoughts.length > 0
        ) {
          entries.push({
            sessionId: chat.sessionId,
            messageId: message.id,
            model: message.model,
            thoughts: message.thoughts,
          });
        }
      }
    }

    return entries;
  }
}
