
// Utilities for verb conjugation
export class VerbUtils {
  // English verb conjugation utilities
  static getEnglishPastTense(verb: string): string {
    // Reglas básicas de conjugación en inglés
    if (verb.endsWith('e')) return `${verb}d`;
    if (verb.endsWith('y')) return `${verb.slice(0, -1)}ied`;
    return `${verb}ed`;
  }

  static getEnglishParticiple(verb: string): string {
    // Similar al pasado en muchos casos
    return this.getEnglishPastTense(verb);
  }

  static getEnglishGerund(verb: string): string {
    // Reglas básicas para el gerundio en inglés
    if (verb.endsWith('e')) return `${verb.slice(0, -1)}ing`;
    return `${verb}ing`;
  }

  // Spanish verb conjugation utilities
  static getSpanishPastTense(verb: string): string {
    // Reglas básicas para el pretérito en español
    if (verb.endsWith('ar')) return `${verb.slice(0, -2)}ó`;
    if (verb.endsWith('er') || verb.endsWith('ir')) return `${verb.slice(0, -2)}ió`;
    return `${verb}ó`;
  }

  static getSpanishParticiple(verb: string): string {
    // Reglas básicas para el participio en español
    if (verb.endsWith('ar')) return `${verb.slice(0, -2)}ado`;
    if (verb.endsWith('er') || verb.endsWith('ir')) return `${verb.slice(0, -2)}ido`;
    return `${verb}ado`;
  }

  static getSpanishGerund(verb: string): string {
    // Reglas básicas para el gerundio en español
    if (verb.endsWith('ar')) return `${verb.slice(0, -2)}ando`;
    if (verb.endsWith('er') || verb.endsWith('ir')) return `${verb.slice(0, -2)}iendo`;
    return `${verb}ando`;
  }
}
