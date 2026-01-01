import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ChatRepository } from "../data/chatRepository.js";
import { UsageAnalyzer } from "../domain/usageAnalyzer.js";
import { ThoughtInspector } from "../domain/thoughtInspector.js";
import { ProjectAnalyzer } from "../domain/projectAnalyzer.js";
import { EfficiencyAnalyzer } from "../domain/efficiencyAnalyzer.js";
import { BehavioralAnalyzer } from "../domain/behavioralAnalyzer.js";
import { GeminiRepository } from "../data/geminiRepository.js";

const server = new McpServer({
  name: "gemini-cli-usage",
  version: "1.0.0",
});

const repo = new ChatRepository(new GeminiRepository());
const analyzer = new UsageAnalyzer();
const thoughtInspector = new ThoughtInspector();
const projectAnalyzer = new ProjectAnalyzer();
const efficiencyAnalyzer = new EfficiencyAnalyzer();
const behavioralAnalyzer = new BehavioralAnalyzer();

server.registerTool(
  "get_token_usage",
  {
    description:
      "Retrieves the aggregated token usage (input, output, total) for the Gemini CLI, broken down by model.",
    inputSchema: z.object({}).shape,
  },
  async () => {
    const chats = repo.getAllChats();
    const report = analyzer.generateReport(chats);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(report, null, 2),
        },
      ],
    };
  }
);

server.registerTool(
  "inspect_thoughts",
  {
    description:
      "Retrieves the internal thoughts/reasoning from Gemini's responses.",
    inputSchema: z.object({
      limit: z
        .number()
        .optional()
        .describe(
          "Limit the number of recent thought entries to return. Defaults to 10."
        ),
    }).shape,
  },
  async ({ limit = 10 }) => {
    const chats = repo.getAllChats();
    const thoughts = thoughtInspector.inspect(chats);

    // Sort by timestamp descending (newest first)
    thoughts.sort((a, b) => {
      const tA = a.thoughts[0]?.timestamp || "";
      const tB = b.thoughts[0]?.timestamp || "";
      return tB.localeCompare(tA);
    });

    const limitedThoughts = thoughts.slice(0, limit);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(limitedThoughts, null, 2),
        },
      ],
    };
  }
);

server.registerTool(
  "get_project_leaderboard",
  {
    description: "Ranks projects by total token consumption.",
    inputSchema: z.object({}).shape,
  },
  async () => {
    const chats = repo.getAllChats();
    const stats = projectAnalyzer.analyze(chats);
    return {
      content: [{ type: "text", text: JSON.stringify(stats, null, 2) }],
    };
  }
);

server.registerTool(
  "analyze_tool_usage",
  {
    description:
      "Analyzes the ratio of tool execution vs conversational output.",
    inputSchema: z.object({}).shape,
  },
  async () => {
    const chats = repo.getAllChats();
    const stats = efficiencyAnalyzer.analyzeToolUsage(chats);
    return {
      content: [{ type: "text", text: JSON.stringify(stats, null, 2) }],
    };
  }
);

server.registerTool(
  "get_context_velocity",
  {
    description:
      "Tracks how fast context grows within sessions to identify heavy conversations.",
    inputSchema: z.object({
      limit: z.number().optional().default(5),
    }).shape,
  },
  async ({ limit }) => {
    const chats = repo.getAllChats();
    const stats = efficiencyAnalyzer.analyzeContextVelocity(chats);

    // Sort by average growth descending
    stats.sort((a, b) => b.averageGrowthPerMessage - a.averageGrowthPerMessage);

    return {
      content: [
        { type: "text", text: JSON.stringify(stats.slice(0, limit), null, 2) },
      ],
    };
  }
);

server.registerTool(
  "get_tool_popularity",
  {
    description: "Ranks tools by frequency of use.",
    inputSchema: z.object({}).shape,
  },
  async () => {
    const chats = repo.getAllChats();
    const stats = efficiencyAnalyzer.analyzeToolPopularity(chats);
    return {
      content: [{ type: "text", text: JSON.stringify(stats, null, 2) }],
    };
  }
);

server.registerTool(
  "get_cache_efficiency",
  {
    description: "Calculates cache hit rates and token savings.",
    inputSchema: z.object({}).shape,
  },
  async () => {
    const chats = repo.getAllChats();
    const stats = efficiencyAnalyzer.analyzeCacheEfficiency(chats);
    return {
      content: [{ type: "text", text: JSON.stringify(stats, null, 2) }],
    };
  }
);

server.registerTool(
  "get_productivity_heatmap",
  {
    description: "Generates data for a heatmap of activity by day and hour.",
    inputSchema: z.object({}).shape,
  },
  async () => {
    const chats = repo.getAllChats();
    const stats = behavioralAnalyzer.getProductivityHeatmap(chats);
    return {
      content: [{ type: "text", text: JSON.stringify(stats, null, 2) }],
    };
  }
);

server.registerTool(
  "identify_binge_sessions",
  {
    description: "Identifies and ranks long, high-density coding sessions.",
    inputSchema: z.object({
      limit: z.number().optional().default(10),
    }).shape,
  },
  async ({ limit }) => {
    const chats = repo.getAllChats();
    const { byDuration, byDensity } =
      behavioralAnalyzer.identifyBingeSessions(chats);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              byDuration: byDuration.slice(0, limit),
              byDensity: byDensity.slice(0, limit),
            },
            null,
            2
          ),
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
