import { ObjectType, Field } from "type-graphql";
import { User } from "../entities/User";
import CommonRes from "./objectType";

@ObjectType()
export class UserRes extends CommonRes {
  @Field(() => User, { nullable: true, defaultValue: null })
  data?: User;
}

@ObjectType()
export class UsersRes extends CommonRes {
  @Field(() => [User], { nullable: true, defaultValue: null })
  data?: User[];
}







