import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Coordinates {
  @Field()
  lat: number;

  @Field()
  lng: number;
}

@ObjectType()
export class ICoordinates {
  @Field()
  coordinates: Coordinates;
}
