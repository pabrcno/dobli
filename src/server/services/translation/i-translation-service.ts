import { EISOLanguages } from "./e-iso-languages";

export interface ITranslationService {
  translateText(
    text: string,

    toLanguage: EISOLanguages
  ): Promise<string>;
}
