import { ObjectType, Field } from "type-graphql";
import { ResponseType } from '../types/index';

@ObjectType()
export class HelloResponse extends ResponseType {
  @Field({ nullable: true, defaultValue: null })
  data?: string;
}