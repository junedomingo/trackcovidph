import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class ConfirmedByResidenceResponse {
  @Field()
  count: number;

  @Field()
  residence: string;
}
