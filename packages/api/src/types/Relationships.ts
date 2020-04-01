import { Field, ObjectType } from 'type-graphql';
import { Sibling } from './Sibling';
import { Niece } from './Niece';
import { Nephew } from './Nephew';

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
  siblings: Sibling[];

  @Field(() => [Niece])
  nieces: Niece[];

  @Field(() => [Nephew])
  nephews: Nephew[];
}
