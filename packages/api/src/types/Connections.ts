import { Sibling } from './Sibling';
import { Niece } from './Niece';
import { Nephew } from './Nephew';

export interface Connections {
  mother: string | null;
  father: string | null;
  children: string[];
  siblings: Sibling[];
  nieces: Niece[];
  nephews: Nephew[];
}
