
import { ContentType, ContentField, GeneratedItem, Language } from '../types';

// Sample sentences for English
const englishVerbs = [
  { base: "walk", past: "walked", participle: "walked", gerund: "walking" },
  { base: "run", past: "ran", participle: "run", gerund: "running" },
  { base: "eat", past: "ate", participle: "eaten", gerund: "eating" },
  { base: "sleep", past: "slept", participle: "slept", gerund: "sleeping" },
  { base: "speak", past: "spoke", participle: "spoken", gerund: "speaking" },
  { base: "write", past: "wrote", participle: "written", gerund: "writing" },
  { base: "read", past: "read", participle: "read", gerund: "reading" },
  { base: "see", past: "saw", participle: "seen", gerund: "seeing" },
  { base: "buy", past: "bought", participle: "bought", gerund: "buying" },
  { base: "bring", past: "brought", participle: "brought", gerund: "bringing" },
];

// Sample sentences for Spanish
const spanishVerbs = [
  { base: "caminar", past: "caminó", participle: "caminado", gerund: "caminando" },
  { base: "correr", past: "corrió", participle: "corrido", gerund: "corriendo" },
  { base: "comer", past: "comió", participle: "comido", gerund: "comiendo" },
  { base: "dormir", past: "durmió", participle: "dormido", gerund: "durmiendo" },
  { base: "hablar", past: "habló", participle: "hablado", gerund: "hablando" },
  { base: "escribir", past: "escribió", participle: "escrito", gerund: "escribiendo" },
  { base: "leer", past: "leyó", participle: "leído", gerund: "leyendo" },
  { base: "ver", past: "vio", participle: "visto", gerund: "viendo" },
  { base: "comprar", past: "compró", participle: "comprado", gerund: "comprando" },
  { base: "traer", past: "trajo", participle: "traído", gerund: "trayendo" },
];

const englishSubjects = ["I", "You", "He", "She", "We", "They"];
const spanishSubjects = ["Yo", "Tú", "Él", "Ella", "Nosotros", "Ellos"];

const englishComplements = [
  "to the park", "at home", "with friends", "in the morning",
  "during the weekend", "for pleasure", "after dinner", "before breakfast",
  "at school", "in the garden", "on weekends", "at night"
];

const spanishComplements = [
  "al parque", "en casa", "con amigos", "en la mañana",
  "durante el fin de semana", "por placer", "después de cenar", "antes del desayuno",
  "en la escuela", "en el jardín", "los fines de semana", "por la noche"
];

const englishNouns = [
  "book", "car", "house", "dog", "cat", "computer", "phone", "table", 
  "chair", "window", "door", "tree", "flower", "sun", "moon", "water"
];

const spanishNouns = [
  "libro", "coche", "casa", "perro", "gato", "computadora", "teléfono", "mesa", 
  "silla", "ventana", "puerta", "árbol", "flor", "sol", "luna", "agua"
];

const englishAdjectives = [
  "big", "small", "red", "blue", "happy", "sad", "interesting", "boring",
  "good", "bad", "hot", "cold", "new", "old", "beautiful", "ugly"
];

const spanishAdjectives = [
  "grande", "pequeño", "rojo", "azul", "feliz", "triste", "interesante", "aburrido",
  "bueno", "malo", "caliente", "frío", "nuevo", "viejo", "hermoso", "feo"
];

// Functions for generating random data
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Generate a complete sentence
const generateSentence = (language: Language): string => {
  if (language === 'en') {
    const subject = getRandomElement(englishSubjects);
    const verb = getRandomElement(englishVerbs);
    const tense = getRandomElement(['present', 'past', 'future', 'present perfect']);
    const complement = getRandomElement(englishComplements);

    switch (tense) {
      case 'present':
        if (subject === 'He' || subject === 'She') {
          return `${subject} ${verb.base}s ${complement}.`;
        } else {
          return `${subject} ${verb.base} ${complement}.`;
        }
      case 'past':
        return `${subject} ${verb.past} ${complement}.`;
      case 'future':
        return `${subject} will ${verb.base} ${complement}.`;
      case 'present perfect':
        if (subject === 'He' || subject === 'She') {
          return `${subject} has ${verb.participle} ${complement}.`;
        } else {
          return `${subject} have ${verb.participle} ${complement}.`;
        }
      default:
        return `${subject} ${verb.base} ${complement}.`;
    }
  } else {
    const subject = getRandomElement(spanishSubjects);
    const verb = getRandomElement(spanishVerbs);
    const tense = getRandomElement(['present', 'past', 'future', 'present perfect']);
    const complement = getRandomElement(spanishComplements);

    switch (tense) {
      case 'present':
        if (subject === 'Yo') {
          return `${subject} ${verb.base}o ${complement}.`;
        } else if (subject === 'Tú') {
          return `${subject} ${verb.base}s ${complement}.`;
        } else if (subject === 'Él' || subject === 'Ella') {
          return `${subject} ${verb.base} ${complement}.`;
        } else if (subject === 'Nosotros') {
          return `${subject} ${verb.base}mos ${complement}.`;
        } else {
          return `${subject} ${verb.base}n ${complement}.`;
        }
      case 'past':
        return `${subject} ${verb.past} ${complement}.`;
      case 'future':
        return `${subject} ${verb.base}rá ${complement}.`;
      case 'present perfect':
        if (subject === 'Yo') {
          return `${subject} he ${verb.participle} ${complement}.`;
        } else if (subject === 'Tú') {
          return `${subject} has ${verb.participle} ${complement}.`;
        } else if (subject === 'Él' || subject === 'Ella') {
          return `${subject} ha ${verb.participle} ${complement}.`;
        } else if (subject === 'Nosotros') {
          return `${subject} hemos ${verb.participle} ${complement}.`;
        } else {
          return `${subject} han ${verb.participle} ${complement}.`;
        }
      default:
        return `${subject} ${verb.base} ${complement}.`;
    }
  }
};

// Generate a gap-fill sentence (with a blank)
const generateGapFillSentence = (language: Language): { sentence: string, answer: string } => {
  if (language === 'en') {
    const subject = getRandomElement(englishSubjects);
    const verb = getRandomElement(englishVerbs);
    const tense = getRandomElement(['present', 'past', 'future', 'present perfect']);
    const complement = getRandomElement(englishComplements);
    let fullSentence = '';
    let gappedSentence = '';
    let answer = '';

    switch (tense) {
      case 'present':
        if (subject === 'He' || subject === 'She') {
          fullSentence = `${subject} ${verb.base}s ${complement}.`;
          gappedSentence = `${subject} _____ ${complement}.`;
          answer = `${verb.base}s`;
        } else {
          fullSentence = `${subject} ${verb.base} ${complement}.`;
          gappedSentence = `${subject} _____ ${complement}.`;
          answer = verb.base;
        }
        break;
      case 'past':
        fullSentence = `${subject} ${verb.past} ${complement}.`;
        gappedSentence = `${subject} _____ ${complement}.`;
        answer = verb.past;
        break;
      case 'future':
        fullSentence = `${subject} will ${verb.base} ${complement}.`;
        gappedSentence = `${subject} will _____ ${complement}.`;
        answer = verb.base;
        break;
      case 'present perfect':
        if (subject === 'He' || subject === 'She') {
          fullSentence = `${subject} has ${verb.participle} ${complement}.`;
          gappedSentence = `${subject} has _____ ${complement}.`;
          answer = verb.participle;
        } else {
          fullSentence = `${subject} have ${verb.participle} ${complement}.`;
          gappedSentence = `${subject} have _____ ${complement}.`;
          answer = verb.participle;
        }
        break;
    }
    
    return { sentence: gappedSentence, answer };
  } else {
    const subject = getRandomElement(spanishSubjects);
    const verb = getRandomElement(spanishVerbs);
    const tense = getRandomElement(['present', 'past', 'future', 'present perfect']);
    const complement = getRandomElement(spanishComplements);
    let fullSentence = '';
    let gappedSentence = '';
    let answer = '';

    switch (tense) {
      case 'present':
        if (subject === 'Yo') {
          fullSentence = `${subject} ${verb.base}o ${complement}.`;
          gappedSentence = `${subject} _____ ${complement}.`;
          answer = `${verb.base}o`;
        } else if (subject === 'Tú') {
          fullSentence = `${subject} ${verb.base}s ${complement}.`;
          gappedSentence = `${subject} _____ ${complement}.`;
          answer = `${verb.base}s`;
        } else if (subject === 'Él' || subject === 'Ella') {
          fullSentence = `${subject} ${verb.base} ${complement}.`;
          gappedSentence = `${subject} _____ ${complement}.`;
          answer = verb.base;
        } else if (subject === 'Nosotros') {
          fullSentence = `${subject} ${verb.base}mos ${complement}.`;
          gappedSentence = `${subject} _____ ${complement}.`;
          answer = `${verb.base}mos`;
        } else {
          fullSentence = `${subject} ${verb.base}n ${complement}.`;
          gappedSentence = `${subject} _____ ${complement}.`;
          answer = `${verb.base}n`;
        }
        break;
      case 'past':
        fullSentence = `${subject} ${verb.past} ${complement}.`;
        gappedSentence = `${subject} _____ ${complement}.`;
        answer = verb.past;
        break;
      case 'future':
        fullSentence = `${subject} ${verb.base}rá ${complement}.`;
        gappedSentence = `${subject} _____ ${complement}.`;
        answer = `${verb.base}rá`;
        break;
      case 'present perfect':
        if (subject === 'Yo') {
          fullSentence = `${subject} he ${verb.participle} ${complement}.`;
          gappedSentence = `${subject} he _____ ${complement}.`;
          answer = verb.participle;
        } else if (subject === 'Tú') {
          fullSentence = `${subject} has ${verb.participle} ${complement}.`;
          gappedSentence = `${subject} has _____ ${complement}.`;
          answer = verb.participle;
        } else if (subject === 'Él' || subject === 'Ella') {
          fullSentence = `${subject} ha ${verb.participle} ${complement}.`;
          gappedSentence = `${subject} ha _____ ${complement}.`;
          answer = verb.participle;
        } else if (subject === 'Nosotros') {
          fullSentence = `${subject} hemos ${verb.participle} ${complement}.`;
          gappedSentence = `${subject} hemos _____ ${complement}.`;
          answer = verb.participle;
        } else {
          fullSentence = `${subject} han ${verb.participle} ${complement}.`;
          gappedSentence = `${subject} han _____ ${complement}.`;
          answer = verb.participle;
        }
        break;
    }
    
    return { sentence: gappedSentence, answer };
  }
};

// Generate a noun phrase
const generateNounPhrase = (language: Language): string => {
  if (language === 'en') {
    const adjective = getRandomElement(englishAdjectives);
    const noun = getRandomElement(englishNouns);
    return `the ${adjective} ${noun}`;
  } else {
    const adjective = getRandomElement(spanishAdjectives);
    const noun = getRandomElement(spanishNouns);
    // In Spanish, adjectives usually come after nouns
    return `el ${noun} ${adjective}`;
  }
};

// Main function to generate content items
export const generateContentItems = (
  contentType: ContentType,
  count: number,
  language: Language
): GeneratedItem[] => {
  const selectedFields = contentType.fields.filter(field => field.selected);
  
  const items: GeneratedItem[] = [];
  
  for (let i = 0; i < count; i++) {
    const item: GeneratedItem = {};
    
    selectedFields.forEach(field => {
      switch (field.id) {
        case 'completeSentence':
          item[field.name] = generateSentence(language);
          break;
        case 'gapFillSentence':
          const gapFill = generateGapFillSentence(language);
          item[field.name] = gapFill.sentence;
          item['answer'] = gapFill.answer;
          break;
        case 'verb':
          if (language === 'en') {
            const verb = getRandomElement(englishVerbs);
            item[field.name] = verb.base;
            item['pastTense'] = verb.past;
            item['participle'] = verb.participle;
            item['gerund'] = verb.gerund;
          } else {
            const verb = getRandomElement(spanishVerbs);
            item[field.name] = verb.base;
            item['pastTense'] = verb.past;
            item['participle'] = verb.participle;
            item['gerund'] = verb.gerund;
          }
          break;
        case 'nounPhrase':
          item[field.name] = generateNounPhrase(language);
          break;
        case 'subject':
          item[field.name] = language === 'en' 
            ? getRandomElement(englishSubjects) 
            : getRandomElement(spanishSubjects);
          break;
        case 'noun':
          item[field.name] = language === 'en' 
            ? getRandomElement(englishNouns) 
            : getRandomElement(spanishNouns);
          break;
        case 'adjective':
          item[field.name] = language === 'en' 
            ? getRandomElement(englishAdjectives) 
            : getRandomElement(spanishAdjectives);
          break;
        case 'id':
          item[field.name] = i + 1;
          break;
        default:
          item[field.name] = `Value for ${field.name}`;
      }
    });
    
    items.push(item);
  }
  
  return items;
};

// Get available content types
export const getContentTypes = (): ContentType[] => {
  return [
    {
      id: 'sentences',
      name: 'Complete Sentences',
      description: 'Generate complete sentences in various tenses',
      selected: true,
      fields: [
        { id: 'id', name: 'ID', type: 'number', selected: true },
        { id: 'completeSentence', name: 'Sentence', type: 'text', selected: true }
      ]
    },
    {
      id: 'gapFill',
      name: 'Gap Fill Exercises',
      description: 'Generate sentences with gaps for students to fill',
      selected: false,
      fields: [
        { id: 'id', name: 'ID', type: 'number', selected: true },
        { id: 'gapFillSentence', name: 'Sentence with Gap', type: 'text', selected: true },
        { id: 'answer', name: 'Answer', type: 'text', selected: true }
      ]
    },
    {
      id: 'verbConjugation',
      name: 'Verb Conjugations',
      description: 'Generate verb forms in different tenses',
      selected: false,
      fields: [
        { id: 'id', name: 'ID', type: 'number', selected: true },
        { id: 'verb', name: 'Base Verb', type: 'text', selected: true },
        { id: 'pastTense', name: 'Past Tense', type: 'text', selected: true },
        { id: 'participle', name: 'Past Participle', type: 'text', selected: true },
        { id: 'gerund', name: 'Gerund', type: 'text', selected: true }
      ]
    },
    {
      id: 'vocabulary',
      name: 'Vocabulary Items',
      description: 'Generate nouns, adjectives, and phrases for vocabulary practice',
      selected: false,
      fields: [
        { id: 'id', name: 'ID', type: 'number', selected: true },
        { id: 'noun', name: 'Noun', type: 'text', selected: true },
        { id: 'adjective', name: 'Adjective', type: 'text', selected: true },
        { id: 'nounPhrase', name: 'Noun Phrase', type: 'text', selected: true }
      ]
    }
  ];
};
