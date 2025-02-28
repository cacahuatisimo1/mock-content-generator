
import { GeneratedItem, ContentType, Language } from '../types';
import { DictionaryEntry } from './dictionary/types';
import { DictionaryApi } from './dictionary/api';
import { VerbUtils } from './dictionary/verbUtils';
import { SentenceGenerator } from './dictionary/sentenceGenerator';

// Service class to handle dictionary API calls
export class DictionaryService {
  // Fetch word data from the Free Dictionary API
  static async fetchWordData(word: string, language: Language = 'en'): Promise<DictionaryEntry | null> {
    return DictionaryApi.fetchWordData(word, language);
  }

  // Get a list of common English or Spanish words
  static getCommonWords(language: Language): string[] {
    return DictionaryApi.getCommonWords(language);
  }

  // Generate content items using dictionary API data
  static async generateContentItems(
    contentType: ContentType,
    count: number,
    language: Language
  ): Promise<GeneratedItem[]> {
    const selectedFields = contentType.fields.filter(field => field.selected);
    const items: GeneratedItem[] = [];
    const commonWords = this.getCommonWords(language);
    
    // Process in batches to avoid too many simultaneous API calls
    const batchSize = Math.min(count, 5);
    
    for (let i = 0; i < count; i += batchSize) {
      const batchPromises = [];
      
      for (let j = 0; j < batchSize && i + j < count; j++) {
        const randomWord = commonWords[Math.floor(Math.random() * commonWords.length)];
        batchPromises.push(this.createContentItem(i + j, randomWord, selectedFields, language));
      }
      
      const batchResults = await Promise.all(batchPromises);
      items.push(...batchResults.filter(item => item !== null) as GeneratedItem[]);
    }
    
    return items;
  }

  // Create a single content item with real dictionary data
  private static async createContentItem(
    index: number,
    word: string,
    selectedFields: any[],
    language: Language
  ): Promise<GeneratedItem | null> {
    try {
      const wordData = await this.fetchWordData(word, language);
      if (!wordData) return null;
      
      const item: GeneratedItem = {};
      
      for (const field of selectedFields) {
        switch (field.id) {
          case 'id':
            item[field.name] = index + 1;
            break;
            
          case 'completeSentence':
            const meaning = wordData.meanings[0]?.definitions[0];
            if (meaning?.example) {
              item[field.name] = meaning.example;
            } else {
              item[field.name] = SentenceGenerator.generateSentence(wordData, language);
            }
            break;
            
          case 'gapFillSentence':
            const sentence = SentenceGenerator.generateSentence(wordData, language);
            const gapSentence = sentence.replace(word, '___');
            item[field.name] = gapSentence;
            item['answer'] = word;
            break;
            
          case 'verb':
            if (wordData.meanings.some(m => m.partOfSpeech === 'verb')) {
              item[field.name] = word;
              // Para verbos, intentamos ser más precisos con las conjugaciones
              if (language === 'en') {
                item['pastTense'] = VerbUtils.getEnglishPastTense(word);
                item['participle'] = VerbUtils.getEnglishParticiple(word);
                item['gerund'] = VerbUtils.getEnglishGerund(word);
              } else {
                item['pastTense'] = VerbUtils.getSpanishPastTense(word);
                item['participle'] = VerbUtils.getSpanishParticiple(word);
                item['gerund'] = VerbUtils.getSpanishGerund(word);
              }
            } else {
              item[field.name] = word;
              item['pastTense'] = language === 'en' ? `${word}ed` : `${word}ó`;
              item['participle'] = language === 'en' ? `${word}ed` : `${word}ado`;
              item['gerund'] = language === 'en' ? `${word}ing` : `${word}ando`;
            }
            break;
            
          case 'noun':
            if (wordData.meanings.some(m => m.partOfSpeech === 'noun')) {
              item[field.name] = word;
            } else {
              const nouns = this.getCommonWords(language).slice(0, 10);
              item[field.name] = nouns[Math.floor(Math.random() * nouns.length)];
            }
            break;
            
          case 'adjective':
            if (wordData.meanings.some(m => m.partOfSpeech === 'adjective')) {
              item[field.name] = word;
            } else {
              const adjectives = language === 'en' 
                ? ['good', 'bad', 'happy', 'sad', 'big', 'small']
                : ['bueno', 'malo', 'feliz', 'triste', 'grande', 'pequeño'];
              item[field.name] = adjectives[Math.floor(Math.random() * adjectives.length)];
            }
            break;
            
          case 'definition':
            item[field.name] = wordData.meanings[0]?.definitions[0]?.definition || '';
            break;
            
          case 'nounPhrase':
            const adj = language === 'en' ? 'good' : 'bueno';
            item[field.name] = language === 'en' ? `the ${adj} ${word}` : `el ${word} ${adj}`;
            break;
            
          default:
            item[field.name] = `${word}`;
        }
      }
      
      return item;
    } catch (error) {
      console.error('Error creating content item:', error);
      return null;
    }
  }
}
