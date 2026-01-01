import { Chat } from "./types.js";

export type ProjectStats = {
  projectHash: string;
  totalTokens: number;
  sessionCount: number;
  lastActive: string;
};

export class ProjectAnalyzer {
  public analyze(chats: Chat[]): ProjectStats[] {
    const projectMap = new Map<string, ProjectStats>();

    for (const chat of chats) {
      const stats = projectMap.get(chat.projectHash) || {
        projectHash: chat.projectHash,
        totalTokens: 0,
        sessionCount: 0,
        lastActive: chat.lastUpdated,
      };

      stats.sessionCount++;
      if (new Date(chat.lastUpdated) > new Date(stats.lastActive)) {
        stats.lastActive = chat.lastUpdated;
      }

      for (const message of chat.messages) {
        if (message.type === "gemini" && message.tokens) {
          stats.totalTokens += message.tokens.total;
        }
      }

      projectMap.set(chat.projectHash, stats);
    }

    return Array.from(projectMap.values()).sort(
      (a, b) => b.totalTokens - a.totalTokens
    );
  }
}
