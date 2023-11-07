import { EISOLanguages } from "./EISOLanguages";

export interface ITranslationService {
  translateText(
    text: string,

    toLanguage: EISOLanguages
  ): Promise<string>;
}
