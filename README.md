# Gemini CLI Usage Extension

This extension for the [Gemini CLI](https://github.com/google/gemini-cli) provides a comprehensive suite of tools for monitoring and analyzing token consumption, model performance, and user behavior. It enables developers to track costs across different models, identify high-density coding sessions, and optimize tool usage efficiency through detailed reports and visual insights.

## Features

- **Token Usage Tracking**: Monitor aggregated token usage (input, output, total) broken down by model.
- **Cost Analysis**: Track expensive projects and sessions via leaderboards.
- **Behavioral Insights**: Identify "binge" coding sessions and analyze context growth velocity.
- **Efficiency Metrics**: Measure tool usage vs. conversational output to gauge automation levels.
- **Debugging Tools**: Inspect the model's internal "thoughts" and reasoning processes.

## Installation

To install this extension, ensure you have the Gemini CLI set up, then run:

```bash
gemini extensions install https://github.com/chrisburlacu1/gemini-cli-usage
```

_Or if you are developing locally:_

```bash
git clone https://github.com/your-username/gemini-cli-usage.git
cd gemini-cli-usage
npm install
npm run build
gemini extensions link .
```

## Commands

Once installed, the following custom commands are available directly in your chat:

| Command                | Description                                        | Underlying Tool            |
| :--------------------- | :------------------------------------------------- | :------------------------- |
| **/usage:stats**       | Check aggregated token usage statistics.           | `get_token_usage`          |
| **/usage:thoughts**    | Inspect the model's recent internal thoughts.      | `inspect_thoughts`         |
| **/usage:leaderboard** | View project leaderboard by token consumption.     | `get_project_leaderboard`  |
| **/usage:efficiency**  | Analyze tool usage vs. conversational output.      | `analyze_tool_usage`       |
| **/usage:velocity**    | Check context growth velocity.                     | `get_context_velocity`     |
| **/usage:popularity**  | Rank tools by frequency of use.                    | `get_tool_popularity`      |
| **/usage:caching**     | Analyze cache hit rates.                           | `get_cache_efficiency`     |
| **/usage:heatmap**     | Show productivity heatmap (activity by day/hour).  | `get_productivity_heatmap` |
| **/usage:binge**       | Identify long, high-density binge coding sessions. | `identify_binge_sessions`  |

## Tools

This extension exposes several MCP tools that the agent can use autonomously or via the commands above:

- `get_token_usage`: Retrieves usage metrics.
- `inspect_thoughts`: Returns recent internal reasoning logs.
- `get_project_leaderboard`: Ranks projects by cost.
- `analyze_tool_usage`: Calculates automation ratios.
- `get_context_velocity`: Measures session context growth.
- `get_tool_popularity`: Tracks most used tools.
- `get_cache_efficiency`: Reports on caching performance.
- `get_productivity_heatmap`: Generates activity time-series data.
- `identify_binge_sessions`: Finds intense coding periods.

## License

MIT
