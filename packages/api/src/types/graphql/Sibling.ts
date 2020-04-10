import { Field, ObjectType } from 'type-graphql';
import { Patient } from './Patient';

@ObjectType()
export class Sibling {
  @Field(() => String, { nullable: true })
  relationship?: string | null;

  @Field(() => Patient || String, { nullable: true })
  sibling?: Patient | string | null;

  case_id: string;
}
