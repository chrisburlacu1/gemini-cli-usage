import fs from "fs";
import path from "path";
import chalk from "chalk";
import { Chat } from "../domain/types.js";
import { GeminiRepository } from "./geminiRepository.js";

const CHATS_DIR_NAME = "chats";
const BIN_DIR_NAME = "bin";

export class ChatRepository {
  constructor(private readonly geminiRepository: GeminiRepository) {}

  public getAllChats(): Chat[] {
    const geminiTempDir = this.geminiRepository.readTempDir();

    return geminiTempDir
      .filter((dir) => dir !== BIN_DIR_NAME)
      .flatMap((sessionDir) => this.loadChatsFromSession(sessionDir));
  }

  private loadChatsFromSession(sessionDir: string): Chat[] {
    const geminiTempDir = this.geminiRepository.getGlobalTempDir();
    const chatPath = path.join(geminiTempDir, sessionDir, CHATS_DIR_NAME);
    if (!fs.existsSync(chatPath)) return [];

    return fs
      .readdirSync(chatPath)
      .filter((file) => file.endsWith(".json"))
      .map((file) => this.readChatFile(path.join(chatPath, file)))
      .filter((chat) => chat !== null);
  }

  private readChatFile(fullPath: string): Chat | null {
    try {
      const fileContent = fs.readFileSync(fullPath, "utf-8");
      return JSON.parse(fileContent) as Chat;
    } catch (error) {
      console.error(chalk.red(`Failed to read chat file: ${fullPath}`));
      console.error(error);
      return null;
    }
  }
}
