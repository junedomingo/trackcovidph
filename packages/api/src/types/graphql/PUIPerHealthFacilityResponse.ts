import { ObjectType, Field } from 'type-graphql';
import { ICoordinates } from '../shared';

@ObjectType()
export class PUIPerHealthFacilityResponse extends ICoordinates {
  @Field()
  region: string;

  @Field()
  facility: string;

  @Field()
  count: number;
}
