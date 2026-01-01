import { Chat } from "./types.js";

export type ToolEfficiency = {
  model: string;
  toolTokens: number;
  outputTokens: number;
  toolCallsCount: number;
  actionRatio: number; // messages with tools / total gemini messages
  ratio: number; // tool / (tool + output)
};

export type ContextVelocity = {
  sessionId: string;
  projectHash: string;
  averageGrowthPerMessage: number;
  maxContextReached: number;
  messageCount: number;
};

export type ToolPopularity = {
  toolName: string;
  count: number;
};

export type CacheEfficiency = {
  model: string;
  totalInput: number;
  totalCached: number;
  hitRate: number;
};

export class EfficiencyAnalyzer {
  public analyzeToolUsage(chats: Chat[]): ToolEfficiency[] {
    const modelStats = new Map<
      string,
      { tool: number; output: number; toolCalls: number; messageCount: number }
    >();

    for (const chat of chats) {
      for (const message of chat.messages) {
        if (message.type === "gemini" && message.model) {
          const stats = modelStats.get(message.model) || {
            tool: 0,
            output: 0,
            toolCalls: 0,
            messageCount: 0,
          };
          
          stats.messageCount++;
          
          if (message.tokens) {
             stats.tool += message.tokens.tool;
             stats.output += message.tokens.output;
          }
          
          if (message.toolCalls && message.toolCalls.length > 0) {
            stats.toolCalls += message.toolCalls.length;
          }

          modelStats.set(message.model, stats);
        }
      }
    }

    return Array.from(modelStats.entries()).map(([model, stats]) => ({
      model,
      toolTokens: stats.tool,
      outputTokens: stats.output,
      toolCallsCount: stats.toolCalls,
      actionRatio: stats.messageCount > 0 ? stats.toolCalls / stats.messageCount : 0,
      ratio:
        stats.tool + stats.output > 0
          ? stats.tool / (stats.tool + stats.output)
          : 0,
    }));
  }

  public analyzeToolPopularity(chats: Chat[]): ToolPopularity[] {
    const counts = new Map<string, number>();
    for (const chat of chats) {
      for (const message of chat.messages) {
        if (message.type === "gemini" && message.toolCalls) {
          for (const call of message.toolCalls) {
            counts.set(call.name, (counts.get(call.name) || 0) + 1);
          }
        }
      }
    }
    return Array.from(counts.entries())
      .map(([toolName, count]) => ({ toolName, count }))
      .sort((a, b) => b.count - a.count);
  }

  public analyzeCacheEfficiency(chats: Chat[]): CacheEfficiency[] {
    const modelStats = new Map<string, { input: number; cached: number }>();
    for (const chat of chats) {
      for (const message of chat.messages) {
        if (message.type === "gemini" && message.model && message.tokens) {
          const stats = modelStats.get(message.model) || { input: 0, cached: 0 };
          stats.input += message.tokens.input;
          stats.cached += message.tokens.cached;
          modelStats.set(message.model, stats);
        }
      }
    }
    return Array.from(modelStats.entries()).map(([model, stats]) => ({
      model,
      totalInput: stats.input,
      totalCached: stats.cached,
      hitRate: stats.input > 0 ? stats.cached / stats.input : 0,
    }));
  }

  public analyzeContextVelocity(chats: Chat[]): ContextVelocity[] {
    return chats.map((chat) => {
      let totalGrowth = 0;
      let maxContext = 0;
      let geminiMessages = 0;

      for (const message of chat.messages) {
        if (message.type === "gemini" && message.tokens) {
          geminiMessages++;
          totalGrowth += message.tokens.input;
          if (message.tokens.input > maxContext) {
            maxContext = message.tokens.input;
          }
        }
      }

      return {
        sessionId: chat.sessionId,
        projectHash: chat.projectHash,
        averageGrowthPerMessage: geminiMessages > 0 ? totalGrowth / geminiMessages : 0,
        maxContextReached: maxContext,
        messageCount: chat.messages.length,
      };
    });
  }
}
