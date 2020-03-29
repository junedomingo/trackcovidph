import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class CountResponse {
  @Field()
  day: number;

  @Field()
  confirmed: number;

  @Field()
  PUIs: number;

  @Field()
  PUMs: number;

  @Field()
  recovered: number;

  @Field()
  deaths: number;

  @Field()
  tests: number;
}
