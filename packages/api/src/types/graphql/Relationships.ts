import { Field, ObjectType } from 'type-graphql';
import { Sibling } from './Sibling';
import { Niece } from './Niece';
import { Nephew } from './Nephew';
import { Contact } from './Contact';
import { Relative } from './Relative';
import { HouseholdMember } from './Household';
import { Exposure } from './Exposure';

@ObjectType()
export class Relationships {
  @Field(() => String || null, { nullable: true })
  wife?: string | null;

  @Field(() => String || null, { nullable: true })
  husband?: string | null;

  @Field(() => String, { nullable: true })
  mother?: string | null;

  @Field(() => String, { nullable: true })
  father?: string | null;

  @Field(() => [String])
  children?: string[];

  @Field(() => [Sibling])
  siblings?: Sibling[];

  @Field(() => [Niece])
  nieces?: Niece[];

  @Field(() => [Nephew])
  nephews?: Nephew[];

  @Field(() => [Contact])
  contacts?: Contact[];

  @Field(() => [Relative])
  relatives?: Relative[];

  @Field(() => [HouseholdMember])
  householdMembers?: HouseholdMember[];

  @Field(() => [Exposure])
  exposures?: Exposure[];
}
