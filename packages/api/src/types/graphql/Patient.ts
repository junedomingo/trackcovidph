import { ObjectType, Field } from 'type-graphql';
import { ICoordinates } from '../shared';
import { Relationships } from './Relationships';

@ObjectType()
export class Patient extends ICoordinates {
  @Field()
  case_id: string;

  @Field({ nullable: true })
  nationality?: string;

  @Field({ nullable: true })
  date_confirmed?: string;

  @Field({ nullable: true })
  date_reported?: string;

  @Field({ nullable: true })
  age?: number;

  @Field()
  sex: string;

  @Field({ nullable: true })
  status?: string;

  @Field()
  facility: string;

  @Field({ nullable: true })
  symptoms?: string;

  @Field({ nullable: true })
  travel_history?: string;

  @Field(() => Relationships)
  relationships: Relationships;
}
