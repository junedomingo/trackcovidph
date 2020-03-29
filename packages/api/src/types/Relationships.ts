import { Field, ObjectType } from 'type-graphql';
import { Sibling } from './Sibling';

@ObjectType()
export class Relationships {
  @Field(() => String, { nullable: true })
  wife?: string | null;

  @Field(() => String, { nullable: true })
  husband?: string | null;

  @Field(() => String, { nullable: true })
  mother?: string | null;

  @Field(() => String, { nullable: true })
  father?: string | null;

  @Field(() => [String])
  children?: string[];

  @Field(() => [Sibling])
  siblings: Sibling[];
}
