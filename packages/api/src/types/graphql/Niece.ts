import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class Niece {
  @Field(() => String, { nullable: true })
  niece: string | null;

  case_id?: string;
}
