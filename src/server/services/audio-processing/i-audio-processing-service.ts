export interface IAudioProcessingService {
  stt(audioBuffer: Buffer): Promise<string>;

  tts(text: string): Promise<Buffer>;
}
