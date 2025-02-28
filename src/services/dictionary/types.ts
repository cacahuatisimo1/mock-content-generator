
// Types for dictionary service
export interface DictionaryEntry {
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
  // Added support for example sentences from Tatoeba
  examples?: string[];
}
