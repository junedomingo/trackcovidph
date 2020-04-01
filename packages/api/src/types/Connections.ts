import { Sibling } from './Sibling';
import { Niece } from './Niece';
import { Nephew } from './Nephew';
import { Contact } from './Contact';
import { Relative } from './Relative';
import { HouseholdMember } from './Household';
import { Exposure } from './Exposure';

export interface Connections {
  mother: string | null;
  father: string | null;
  children: string[];
  siblings: Sibling[];
  nieces: Niece[];
  nephews: Nephew[];
  contacts: Contact[];
  relatives: Relative[];
  householdMembers: HouseholdMember[];
  exposures: Exposure[];
}
