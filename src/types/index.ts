
export interface ContentField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: string[];
  selected: boolean;
}

export interface ContentType {
  id: string;
  name: string;
  description: string;
  fields: ContentField[];
  selected: boolean;
}

export type Language = 'en' | 'es';

export type OutputFormat = 'json' | 'csv' | 'excel' | 'postgres' | 'mysql' | 'mongodb';

export interface GeneratedItem {
  [key: string]: string | number | Date;
}

export interface GeneratedContent {
  items: GeneratedItem[];
  format: OutputFormat;
}
