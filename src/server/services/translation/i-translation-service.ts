export interface ITranslationService {
  translateAudioToText(audioBlob: Blob, language: string): Promise<string>;
  translateText(
    text: string,
    fromLanguage: string,
    toLanguage: string
  ): Promise<string>;
}
