import chalk from "chalk";
import Table from "cli-table3";
import { UsageReport } from "../domain/usageAnalyzer.js";

export class ConsolePresenter {
  public display(report: UsageReport): void {
    const table = this.createTable();

    // Add Total Row
    table.push([
      chalk.bold.yellow("Total"),
      chalk.yellow(this.formatTokens(report.total.input)),
      chalk.yellow(this.formatTokens(report.total.output)),
      chalk.bold.yellow(
        this.formatTokens(report.total.input + report.total.output)
      ),
    ]);

    // Add Model Rows
    Object.entries(report.byModel).forEach(([model, usage]) => {
      table.push([
        model,
        this.formatTokens(usage.input),
        this.formatTokens(usage.output),
        this.formatTokens(usage.input + usage.output),
      ]);
    });

    console.log(table.toString());
  }

  private createTable(): Table.Table {
    return new Table({
      head: [
        chalk.cyan("Model"),
        chalk.cyan("Input"),
        chalk.cyan("Output"),
        chalk.cyan("Total"),
      ],
      chars: {
        top: "═",
        "top-mid": "╤",
        "top-left": "╔",
        "top-right": "╗",
        bottom: "═",
        "bottom-mid": "╧",
        "bottom-left": "╚",
        "bottom-right": "╝",
        left: "║",
        "left-mid": "╟",
        mid: "─",
        "mid-mid": "┼",
        right: "║",
        "right-mid": "╢",
        middle: "│",
      },
    });
  }

  private formatTokens(tokens: number): string {
    let formatted = tokens / 1_000_000;
    if (formatted >= 1) return `${formatted.toFixed(1)}M`;

    formatted *= 1000; // Convert back to K if < 1M
    if (formatted >= 1) return `${formatted.toFixed(1)}K`;

    return tokens.toString(); // Fallback for small numbers
  }
}
