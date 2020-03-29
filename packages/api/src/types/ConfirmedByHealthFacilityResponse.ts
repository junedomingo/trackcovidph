import { ObjectType, Field } from 'type-graphql';
import { ICoordinates } from './shared';

@ObjectType()
export class ConfirmedByHealthFacilityResponse extends ICoordinates {
  @Field()
  facility: string;

  @Field()
  count: number;
}
