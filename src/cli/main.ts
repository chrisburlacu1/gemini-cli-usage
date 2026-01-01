import chalk from "chalk";
import { ChatRepository } from "../data/chatRepository.js";
import { UsageAnalyzer } from "../domain/usageAnalyzer.js";
import { ConsolePresenter } from "./consolePresenter.js";
import { GeminiRepository } from "../data/geminiRepository.js";

function main() {
  const repo = new ChatRepository(new GeminiRepository());
  const analyzer = new UsageAnalyzer();
  const presenter = new ConsolePresenter();

  console.log(chalk.gray("Reading chat history..."));
  const chats = repo.getAllChats();

  const report = analyzer.generateReport(chats);

  presenter.display(report);
}

main();
