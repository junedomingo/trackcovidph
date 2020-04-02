import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class Contact {
  @Field(() => String, { nullable: true })
  contact: string | null;

  id?: string;
}
