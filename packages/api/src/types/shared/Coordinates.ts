import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Coordinates {
  @Field(() => Number, { nullable: true })
  lat: number;

  @Field(() => Number, { nullable: true })
  lng: number;
}

@ObjectType()
export class ICoordinates {
  @Field()
  coordinates: Coordinates;
}
