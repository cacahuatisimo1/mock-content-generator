
import { DictionaryEntry } from './types';
import { Language } from '../../types';
import { TatoebaApi, TatoebaSentence } from './tatoebaApi';

export class SentenceGenerator {
  // Cache for sentences to avoid duplicate API calls
  private static sentenceCache: Record<string, TatoebaSentence[]> = {};

  /**
   * Generate a sentence using the word data
   * First tries to fetch from Tatoeba, falls back to simple generated sentences
   */
  static async generateSentence(wordData: DictionaryEntry, language: Language): Promise<string> {
    const word = wordData.word;
    
    // Try to get example from Tatoeba
    try {
      const sentences = await this.getTatoebaSentences(word, language);
      
      if (sentences.length > 0) {
        // Return a random sentence from the results
        const randomIndex = Math.floor(Math.random() * sentences.length);
        return sentences[randomIndex].text;
      }
    } catch (error) {
      console.error('Error getting Tatoeba sentences:', error);
    }
    
    // Fallback to generated sentences if Tatoeba fails or returns no results
    return this.generateSimpleSentence(wordData, language);
  }
  
  /**
   * Get example sentences from Tatoeba API
   */
  static async getTatoebaSentences(word: string, language: Language): Promise<TatoebaSentence[]> {
    const cacheKey = `${word}-${language}`;
    
    // Check cache first
    if (this.sentenceCache[cacheKey]) {
      return this.sentenceCache[cacheKey];
    }
    
    // If not in cache, fetch from API
    const sentences = await TatoebaApi.searchSentences(word, language, 5);
    
    // Cache the results
    if (sentences.length > 0) {
      this.sentenceCache[cacheKey] = sentences;
    }
    
    return sentences;
  }

  /**
   * Generate a simple sentence using the word data (fallback)
   */
  static generateSimpleSentence(wordData: DictionaryEntry, language: Language): string {
    const word = wordData.word;
    const partOfSpeech = wordData.meanings[0]?.partOfSpeech || 'noun';
    
    if (language === 'en') {
      switch (partOfSpeech) {
        case 'noun':
          return `The ${word} is an important thing to have.`;
        case 'verb':
          return `I like to ${word} every day.`;
        case 'adjective':
          return `The book is very ${word}.`;
        default:
          return `This is an example of ${word}.`;
      }
    } else {
      switch (partOfSpeech) {
        case 'noun':
          return `El ${word} es una cosa importante para tener.`;
        case 'verb':
          return `Me gusta ${word} todos los días.`;
        case 'adjective':
          return `El libro es muy ${word}.`;
        default:
          return `Este es un ejemplo de ${word}.`;
      }
    }
  }
}
