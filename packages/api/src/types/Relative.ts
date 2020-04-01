import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Relative {
  @Field(() => String, { nullable: true })
  relative: string | null;

  id?: string;
}