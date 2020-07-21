import { Field, ObjectType } from 'type-graphql';
import { Sibling } from './Sibling';
import { Patient } from './Patient';

@ObjectType({})
export class Relationships {
  case_id: string;

  @Field(() => Patient, { nullable: true })
  wife?: Patient;

  @Field(() => Patient, { nullable: true })
  husband?: Patient;

  @Field(() => Patient, { nullable: true })
  mother?: Patient;

  @Field(() => Patient, { nullable: true })
  father?: Patient;

  @Field(() => [Patient], { nullable: true })
  children?: [Patient];

  @Field(() => [Sibling], { nullable: true })
  siblings?: Sibling[];

  @Field(() => [Patient], { nullable: true })
  nieces?: Patient[];

  @Field(() => [Patient], { nullable: true })
  nephews?: Patient[];

  @Field(() => [Patient], { nullable: true })
  contacts?: Patient[];

  @Field(() => [Patient], { nullable: true })
  relatives?: Patient[];

  @Field(() => [Patient], { nullable: true })
  householdMembers?: Patient[];

  @Field(() => [Patient], { nullable: true })
  exposures?: Patient[];
}
