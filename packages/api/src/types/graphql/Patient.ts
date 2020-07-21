import { ObjectType, Field, ID } from 'type-graphql';
import { Relationships } from './Relationships';
import { Facility } from './Facility';

@ObjectType()
export class Patient {
  @Field(() => ID)
  id: number;

  @Field()
  case_id: string;

  @Field(() => [String], { nullable: true })
  nationality?: string[] | null;

  @Field(() => String, { nullable: true })
  date_confirmed?: string | null;

  @Field(() => String, { nullable: true })
  date_reported?: string | null;

  @Field(() => String, { nullable: true })
  date_recovered?: string | null;

  @Field(() => String, { nullable: true })
  date_deceased?: string | null;

  @Field(() => Number, { nullable: true })
  age?: number | null;

  @Field(() => String, { nullable: true })
  sex?: string | null;

  @Field(() => String, { nullable: true })
  residence?: string | null;

  @Field(() => String, { nullable: true })
  status?: string | null;

  @Field(() => Facility, { nullable: true })
  facility?: Facility | null;

  @Field(() => [String], { nullable: true })
  symptoms?: string[];

  @Field(() => [String], { nullable: true })
  travel_history?: string[] | null;

  @Field(() => Relationships, { nullable: true })
  relationships?: Relationships;

  strToParse: string[];
}
