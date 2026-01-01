# Gemini CLI Usage Extension

This extension provides tools to analyze and report token usage statistics for the Gemini CLI.

## Available Commands

You can use the following commands directly in the chat:

- **/usage:stats**: Check aggregated token usage statistics (`get_token_usage`).
- **/usage:thoughts**: Inspect the model's recent internal thoughts (`inspect_thoughts`).
- **/usage:leaderboard**: View project leaderboard by token consumption (`get_project_leaderboard`).
- **/usage:efficiency**: Analyze tool usage vs. conversational output (`analyze_tool_usage`).
- **/usage:velocity**: Check context growth velocity (`get_context_velocity`).
- **/usage:popularity**: Rank tools by frequency of use (`get_tool_popularity`).
- **/usage:caching**: Analyze cache hit rates (`get_cache_efficiency`).
- **/usage:heatmap**: Show productivity heatmap (activity by day/hour) (`get_productivity_heatmap`).
- **/usage:binge**: Identify long, high-density binge coding sessions (`identify_binge_sessions`).

## Model Instructions

You have access to several analysis tools to understand token consumption, model behavior, and project costs.

### Tool: `get_token_usage`
- **Purpose**: Retrieves aggregated token usage (input, output, and total) broken down by model.

### Tool: `inspect_thoughts`
- **Purpose**: Extracts internal reasoning (thoughts) logged by Gemini. Useful for debugging model logic.
- **Parameters**: `limit` (default: 10).

### Tool: `get_project_leaderboard`
- **Purpose**: Ranks projects (by `projectHash`) based on total token usage. Helps identify which codebases are most active/expensive.

### Tool: `analyze_tool_usage`
- **Purpose**: Calculates the "Tool Ratio" (tokens spent on executing tools vs. generating conversational text). High ratios indicate high automation/action.

### Tool: `get_context_velocity`
- **Purpose**: Measures how quickly context grows per message in a session. Helps identify "heavy" sessions that might need to be reset.
- **Parameters**: `limit` (default: 5).

### Presentation Guidelines
- **Project Hash**: If a `projectHash` is displayed, mention it is a unique identifier for the repository/workspace.
- **Tool Ratio**: Express as a percentage (e.g., "75% of output was tool execution").
- **Growth Velocity**: Highlight sessions with abnormally high "Average Growth per Message".
