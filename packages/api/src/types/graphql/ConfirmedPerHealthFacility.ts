import { ObjectType, Field } from 'type-graphql';
import { ICoordinates } from '../shared';

@ObjectType()
export class ConfirmedPerHealthFacility extends ICoordinates {
  @Field()
  facility: string;

  @Field()
  count: number;
}
