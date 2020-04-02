import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Sibling {
  @Field(() => String, { nullable: true })
  relationship?: string;

  @Field(() => String, { nullable: true })
  sibling: string | null;

  id: string;
}
