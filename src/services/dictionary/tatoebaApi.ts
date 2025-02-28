
import { Language } from '../../types';

export interface TatoebaSentence {
  id: number;
  text: string;
  lang: string;
  translations?: TatoebaSentence[];
}

export class TatoebaApi {
  // Tatoeba API endpoint (using their public API)
  private static baseUrl = 'https://tatoeba.org/es/api_v0';
  
  /**
   * Search for sentences containing a specific word
   * @param word The word to search for
   * @param language The language code ('en' for English, 'es' for Spanish)
   * @param limit Maximum number of results to return
   * @returns Array of sentences containing the word
   */
  static async searchSentences(
    word: string, 
    language: Language = 'en', 
    limit: number = 5
  ): Promise<TatoebaSentence[]> {
    try {
      const langCode = language === 'en' ? 'eng' : 'spa';
      const url = `${this.baseUrl}/search?query=${encodeURIComponent(word)}&from=${langCode}&to=&orphans=no&unapproved=no&user=&tags=&list=&has_audio=&trans_filter=limit&trans_to=&trans_link=&trans_user=&trans_orphan=&trans_unapproved=&trans_has_audio=&sort=random&page=1`;
      
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Error fetching from Tatoeba: ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      
      // Process and return the sentences
      return data.results.slice(0, limit).map((result: any) => ({
        id: result.id,
        text: result.text,
        lang: langCode,
        translations: result.translations?.map((trans: any) => ({
          id: trans.id,
          text: trans.text,
          lang: trans.lang
        }))
      }));
    } catch (error) {
      console.error('Error fetching Tatoeba sentences:', error);
      return [];
    }
  }

  /**
   * Get translations of a sentence
   * @param sentenceId The ID of the sentence to get translations for
   * @param targetLang Target language code
   * @returns Array of translated sentences
   */
  static async getSentenceTranslations(
    sentenceId: number, 
    targetLang: string = 'eng'
  ): Promise<TatoebaSentence[]> {
    try {
      const url = `${this.baseUrl}/sentence/${sentenceId}/translations/${targetLang}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`Error fetching translations: ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      return data.translations.map((trans: any) => ({
        id: trans.id,
        text: trans.text,
        lang: trans.lang
      }));
    } catch (error) {
      console.error('Error fetching translations:', error);
      return [];
    }
  }
}
