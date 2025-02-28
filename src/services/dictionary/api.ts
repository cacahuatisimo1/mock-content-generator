
import { DictionaryEntry } from './types';
import { Language } from '../../types';

// Service for dictionary API calls
export class DictionaryApi {
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
}
