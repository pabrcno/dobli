import OpenAI from "openai";
import fs from "fs";
import os from "os";
import path from "path";
import { IAudioProcessingService } from "./i-audio-processing-service";

export class OpenAIAudioProcessingService implements IAudioProcessingService {
  private static instance: OpenAIAudioProcessingService;
  private openai: OpenAI;

  // The constructor is now private.
  private constructor() {
    this.openai = new OpenAI();
  }

  // The getInstance method ensures that only one instance of the class is created.
  public static getInstance(): OpenAIAudioProcessingService {
    if (!OpenAIAudioProcessingService.instance) {
      OpenAIAudioProcessingService.instance =
        new OpenAIAudioProcessingService();
    }
    return OpenAIAudioProcessingService.instance;
  }

  async tts(text: string): Promise<Buffer> {
    const response = await this.openai.audio.speech.create({
      input: text,
      voice: "alloy",
      model: "tts-1",
    });

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  async stt(audioBuffer: Buffer): Promise<string> {
    try {
      // Write the buffer to a temporary file
      const tempFilePath = path.join(os.tmpdir(), "tempaudio.mp3");
      await fs.promises.writeFile(tempFilePath, audioBuffer);

      // Pass the file path to the OpenAI API
      const fileStream = fs.createReadStream(tempFilePath);

      const transcriptionResponse =
        await this.openai.audio.transcriptions.create({
          model: "whisper-1",
          file: fileStream,
        });

      // Clean up the temporary file
      await fs.promises.unlink(tempFilePath);

      return transcriptionResponse.text;
    } catch (error) {
      console.error("Error during STT:", error);
      throw error;
    }
  }
}
