
import { GeneratedItem, ContentType, Language } from '../types';

// Interface for the Free Dictionary API response
interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: {
    text: string;
    audio?: string;
  }[];
  origin?: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
      synonyms: string[];
      antonyms: string[];
    }[];
  }[];
}

// Service class to handle dictionary API calls
export class DictionaryService {
  // Free Dictionary API endpoint (doesn't require API key)
  private static freeDictionaryApiUrl = 'https://api.dictionaryapi.dev/api/v2/entries';
  
  // Fetch word data from the Free Dictionary API
  static async fetchWordData(word: string, language: Language = 'en'): Promise<DictionaryEntry | null> {
    try {
      const langCode = language === 'en' ? 'en' : 'es';
      const response = await fetch(`${this.freeDictionaryApiUrl}/${langCode}/${encodeURIComponent(word)}`);
      
      if (!response.ok) {
        console.error(`Error fetching word "${word}": ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      return data[0] as DictionaryEntry;
    } catch (error) {
      console.error('Error fetching dictionary data:', error);
      return null;
    }
  }

  // Get a list of common English or Spanish words
  static getCommonWords(language: Language): string[] {
    return language === 'en' 
      ? [
          'time', 'person', 'year', 'way', 'day', 'thing', 'man', 'world', 'life', 'hand',
          'part', 'child', 'eye', 'woman', 'place', 'work', 'week', 'case', 'point', 'government',
          'company', 'number', 'group', 'problem', 'fact', 'make', 'good', 'water', 'first', 'people'
        ]
      : [
          'tiempo', 'persona', 'año', 'manera', 'día', 'cosa', 'hombre', 'mundo', 'vida', 'mano',
          'parte', 'niño', 'ojo', 'mujer', 'lugar', 'trabajo', 'semana', 'caso', 'punto', 'gobierno',
          'empresa', 'número', 'grupo', 'problema', 'hecho', 'hacer', 'bueno', 'agua', 'primero', 'gente'
        ];
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
              item[field.name] = this.generateSentence(wordData, language);
            }
            break;
            
          case 'gapFillSentence':
            const sentence = this.generateSentence(wordData, language);
            const gapSentence = sentence.replace(word, '___');
            item[field.name] = gapSentence;
            item['answer'] = word;
            break;
            
          case 'verb':
            if (wordData.meanings.some(m => m.partOfSpeech === 'verb')) {
              item[field.name] = word;
              // Para verbos, intentamos ser más precisos con las conjugaciones
              if (language === 'en') {
                item['pastTense'] = this.getEnglishPastTense(word);
                item['participle'] = this.getEnglishParticiple(word);
                item['gerund'] = this.getEnglishGerund(word);
              } else {
                item['pastTense'] = this.getSpanishPastTense(word);
                item['participle'] = this.getSpanishParticiple(word);
                item['gerund'] = this.getSpanishGerund(word);
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

  // Generate a simple sentence using the word data
  private static generateSentence(wordData: DictionaryEntry, language: Language): string {
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

  // Funciones auxiliares para conjugación de verbos
  private static getEnglishPastTense(verb: string): string {
    // Reglas básicas de conjugación en inglés
    if (verb.endsWith('e')) return `${verb}d`;
    if (verb.endsWith('y')) return `${verb.slice(0, -1)}ied`;
    return `${verb}ed`;
  }

  private static getEnglishParticiple(verb: string): string {
    // Similar al pasado en muchos casos
    return this.getEnglishPastTense(verb);
  }

  private static getEnglishGerund(verb: string): string {
    // Reglas básicas para el gerundio en inglés
    if (verb.endsWith('e')) return `${verb.slice(0, -1)}ing`;
    return `${verb}ing`;
  }

  private static getSpanishPastTense(verb: string): string {
    // Reglas básicas para el pretérito en español
    if (verb.endsWith('ar')) return `${verb.slice(0, -2)}ó`;
    if (verb.endsWith('er') || verb.endsWith('ir')) return `${verb.slice(0, -2)}ió`;
    return `${verb}ó`;
  }

  private static getSpanishParticiple(verb: string): string {
    // Reglas básicas para el participio en español
    if (verb.endsWith('ar')) return `${verb.slice(0, -2)}ado`;
    if (verb.endsWith('er') || verb.endsWith('ir')) return `${verb.slice(0, -2)}ido`;
    return `${verb}ado`;
  }

  private static getSpanishGerund(verb: string): string {
    // Reglas básicas para el gerundio en español
    if (verb.endsWith('ar')) return `${verb.slice(0, -2)}ando`;
    if (verb.endsWith('er') || verb.endsWith('ir')) return `${verb.slice(0, -2)}iendo`;
    return `${verb}ando`;
  }
}
