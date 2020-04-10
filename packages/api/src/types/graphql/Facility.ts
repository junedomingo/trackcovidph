import { ObjectType, Field } from 'type-graphql';
import { ICoordinates } from '../shared';

@ObjectType()
export class Facility extends ICoordinates {
  @Field(() => String, { nullable: true })
  name?: string;
}
