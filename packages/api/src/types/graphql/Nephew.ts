import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class Nephew {
  @Field(() => String, { nullable: true })
  nephew: string | null;

  id?: string;
}
