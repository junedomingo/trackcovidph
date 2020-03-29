import { ObjectType, Field } from 'type-graphql';
import { ICoordinates } from './shared';

@ObjectType()
export class ConfirmedForeignNationalResponse extends ICoordinates {
  @Field()
  case_id: string;

  @Field()
  age: number;

  @Field()
  nationality: string;

  @Field()
  travel_date: string;

  @Field()
  travel_history: string;

  @Field()
  date_confirmed: string;

  @Field()
  where_now: string;

  @Field({ nullable: true })
  status?: string;
}
