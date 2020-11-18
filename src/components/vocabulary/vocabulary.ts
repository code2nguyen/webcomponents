import { Node } from 'slate';

export const NEW_ITEM_ID = 'newItem';
export interface Vocabulary {
  id: string;
  word: string;
  meaning: Node[];
}
