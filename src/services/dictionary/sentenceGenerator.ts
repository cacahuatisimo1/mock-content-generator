
import { DictionaryEntry } from './types';
import { Language } from '../../types';

export class SentenceGenerator {
  // Generate a simple sentence using the word data
  static generateSentence(wordData: DictionaryEntry, language: Language): string {
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
