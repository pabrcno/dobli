import { TranslationServiceClient } from "@google-cloud/translate"; // Import the Google Cloud client library
import { EISOLanguages } from "./EISOLanguages";
import { ITranslationService } from "./i-translation-service";

export class GCPTranslationService implements ITranslationService {
  // Instantiates a client for Google Cloud Translation service
  private translateClient = new TranslationServiceClient({
    keyFilename: "service-account.json",
  });

  async translateText(
    text: string,
    toLanguage: EISOLanguages
  ): Promise<string> {
    try {
      const parent = `projects/${process.env.GOOGLE_PROJECT_ID}/locations/us-central1`;
      // Calls the Google Cloud Translation API to translate the text
      const translationsResponse = await this.translateClient.translateText({
        parent,
        contents: [text],
        mimeType: "text/plain", // mime types: text/plain, text/html

        targetLanguageCode: toLanguage,
      });

      if (
        !translationsResponse[0].translations ||
        !translationsResponse[0].translations[0].translatedText
      ) {
        throw new Error("Translation failed");
      }
      return translationsResponse[0].translations[0].translatedText;
    } catch (error) {
      console.error("Error while translating text:", error);
      throw error; // Rethrow the error after logging it
    }
  }
}
