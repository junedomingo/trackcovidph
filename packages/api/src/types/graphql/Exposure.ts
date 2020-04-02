import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Exposure {
  @Field(() => String, { nullable: true })
  exposure: string | null;

  case_id?: string;
}
