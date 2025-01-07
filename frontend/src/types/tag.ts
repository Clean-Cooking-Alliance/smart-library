export interface Tag {
    id: number;
    name: string;
    category: 'region' | 'topic' | 'technology' | 'framework' | 'country' | 'unknown';
  }