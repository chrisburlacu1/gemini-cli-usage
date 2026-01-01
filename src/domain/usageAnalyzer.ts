import { Chat } from "./types.js";

export type Usage = {
  input: number;
  output: number;
};

export type UsageReport = {
  total: Usage;
  byModel: Record<string, Usage>;
};

export class UsageAnalyzer {
  public generateReport(chats: Chat[]): UsageReport {
    const total: Usage = { input: 0, output: 0 };
    const modelUsageMap = new Map<string, Usage>();

    for (const chat of chats) {
      this.processChat(chat, total, modelUsageMap);
    }

    return {
      total,
      byModel: Object.fromEntries(modelUsageMap),
    };
  }

  private processChat(
    chat: Chat,
    total: Usage,
    modelMap: Map<string, Usage>
  ): void {
    chat.messages.forEach((message) => {
      if (message.type !== "gemini" || !message.tokens || !message.model) return;

      const { input, output } = message.tokens;

      // Update Total
      total.input += input;
      total.output += output;

      // Update Model Specific
      const modelStats = modelMap.get(message.model) || { input: 0, output: 0 };
      modelStats.input += input;
      modelStats.output += output;
      modelMap.set(message.model, modelStats);
    });
  }
}
