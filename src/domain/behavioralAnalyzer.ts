import { Chat } from "./types.js";

export type HeatmapData = {
  dayOfWeek: number; // 0-6
  hourOfDay: number; // 0-23
  count: number;
  inputTokens: number;
  outputTokens: number;
  topProjectHash?: string | undefined;
};

export type BingeSession = {
  sessionId: string;
  projectHash: string;
  durationMinutes: number;
  messageCount: number;
  density: number; // msgs per minute
  startTime: string;
  summary?: string | undefined;
};

export class BehavioralAnalyzer {
  public getProductivityHeatmap(chats: Chat[]): HeatmapData[] {
    const map = new Map<
      string,
      {
        count: number;
        input: number;
        output: number;
        projects: Map<string, number>;
      }
    >();

    for (const chat of chats) {
      for (const message of chat.messages) {
        if (!message.timestamp) continue;
        const date = new Date(message.timestamp);
        const day = date.getDay();
        const hour = date.getHours();
        const key = `${day}-${hour}`;

        const stats = map.get(key) || {
          count: 0,
          input: 0,
          output: 0,
          projects: new Map<string, number>(),
        };

        stats.count++;
        if (message.type === "gemini" && message.tokens) {
          stats.input += message.tokens.input;
          stats.output += message.tokens.output;
        }

        const projCount = stats.projects.get(chat.projectHash) || 0;
        stats.projects.set(chat.projectHash, projCount + 1);

        map.set(key, stats);
      }
    }

    const result: HeatmapData[] = [];
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const key = `${day}-${hour}`;
        const stats = map.get(key);

        let topProjectHash: string | undefined;
        if (stats) {
          let maxProjCount = 0;
          for (const [hash, count] of stats.projects.entries()) {
            if (count > maxProjCount) {
              maxProjCount = count;
              topProjectHash = hash;
            }
          }
        }

        result.push({
          dayOfWeek: day,
          hourOfDay: hour,
          count: stats?.count || 0,
          inputTokens: stats?.input || 0,
          outputTokens: stats?.output || 0,
          topProjectHash,
        });
      }
    }
    return result;
  }

  public identifyBingeSessions(chats: Chat[]): { byDuration: BingeSession[]; byDensity: BingeSession[] } {
    const sessions = chats
      .map((chat) => {
        const start = new Date(chat.startTime).getTime();
        const end = new Date(chat.lastUpdated).getTime();
        const durationMinutes = Math.max(1, (end - start) / (1000 * 60));
        const messageCount = chat.messages.length;

        return {
          sessionId: chat.sessionId,
          projectHash: chat.projectHash,
          durationMinutes: Math.round(durationMinutes),
          messageCount,
          density: Number((messageCount / durationMinutes).toFixed(2)),
          startTime: chat.startTime,
          summary: chat.summary,
        };
      });

    const byDuration = [...sessions].sort((a, b) => b.durationMinutes - a.durationMinutes);
    const byDensity = [...sessions].sort((a, b) => b.density - a.density);

    return { byDuration, byDensity };
  }
}
