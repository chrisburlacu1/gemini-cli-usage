import os from "os";
import path from "path";
import fs from "fs";

const GEMINI_DIR = ".gemini";
const TMP_DIR_NAME = "tmp";

export class GeminiRepository {
  readGeminiDir(): string[] {
    return fs.readdirSync(this.getGlobalGeminiDir());
  }

  readTempDir(): string[] {
    return fs.readdirSync(this.getGlobalTempDir());
  }

  getGlobalGeminiDir(): string {
    const homeDir = os.homedir();
    if (!homeDir) {
      return path.join(os.tmpdir(), GEMINI_DIR);
    }
    return path.join(homeDir, GEMINI_DIR);
  }

  getGlobalTempDir(): string {
    return path.join(this.getGlobalGeminiDir(), TMP_DIR_NAME);
  }
}
