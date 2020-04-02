import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class HouseholdMember {
  @Field(() => String, { nullable: true })
  household: string | null;

  case_id?: string;
}
