import { ObjectType, Field } from "type-graphql";
import CommonRes from "./objectType";

@ObjectType()
export class HelloResponse extends CommonRes {
  @Field({ nullable: true, defaultValue: null })
  data?: string;
}