import { ObjectType, Field } from 'type-graphql';
import { ICoordinates } from './shared';

@ObjectType()
export class ConfirmedOFWResponse extends ICoordinates {
  @Field()
  case_id: string;

  @Field()
  age: number;

  @Field()
  sex: string;

  @Field()
  country: string;

  @Field()
  date_reported: string;

  @Field()
  date_confirmed: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  remarks?: string;
}
