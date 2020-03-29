import { Sibling } from './Sibling';

export interface Connections {
  mother: string | null;
  father: string | null;
  children: string[];
  siblings: Sibling[];
}
