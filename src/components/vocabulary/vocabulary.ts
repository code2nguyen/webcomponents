import { Node } from 'slate';

export interface Vocabulary {
  id: string;
  word: string;
  meaning: Node[];
}

export type ExtraVocabulary = Vocabulary & { isNew?: boolean };
