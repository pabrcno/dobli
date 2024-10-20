export interface IAudioProcessingService {
  stt(audioBuffer: Uint8Array[]): Promise<string>;

  tts(text: string): Promise<Buffer>;
}
