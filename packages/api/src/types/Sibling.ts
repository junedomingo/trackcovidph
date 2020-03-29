import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Sibling {
  @Field(() => String)
  relationship: string;

  @Field(() => String, { nullable: true })
  sibling: string | null;

  @Field(() => String)
  id: string;
}
