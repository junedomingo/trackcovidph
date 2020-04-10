import { Field, ObjectType } from 'type-graphql';
import { Sibling } from './Sibling';
import { Patient } from './Patient';

@ObjectType({})
export class Relationships {
  case_id: string;

  @Field(() => Patient, { nullable: true })
  wife: Patient;

  @Field(() => Patient, { nullable: true })
  husband: Patient;

  @Field(() => Patient, { nullable: true })
  mother: Patient;

  @Field(() => Patient, { nullable: true })
  father: Patient;

  @Field(() => [Patient])
  children: [Patient];

  @Field(() => [Sibling])
  siblings: Sibling[];

  @Field(() => [Patient])
  nieces: Patient[];

  @Field(() => [Patient])
  nephews: Patient[];

  @Field(() => [Patient])
  contacts: Patient[];

  @Field(() => [Patient])
  relatives: Patient[];

  @Field(() => [Patient])
  householdMembers: Patient[];

  @Field(() => [Patient])
  exposures: Patient[];
}
