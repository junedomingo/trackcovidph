import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class ConfirmedPerResidenceResponse {
  @Field()
  count: number;

  @Field()
  residence: string;
}
