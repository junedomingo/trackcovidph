import { Sibling, Niece, Nephew, Contact, Relative, HouseholdMember, Exposure } from '../graphql';

export interface Connections {
  mother: string | null;
  father: string | null;
  children: string[];
  siblings?: Sibling[];
  nieces?: Niece[];
  nephews?: Nephew[];
  contacts?: Contact[];
  relatives?: Relative[];
  householdMembers?: HouseholdMember[];
  exposures?: Exposure[];
}
