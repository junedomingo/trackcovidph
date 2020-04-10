import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class ConfirmedPerResidence {
  @Field()
  count: number;

  @Field()
  residence: string;
}
