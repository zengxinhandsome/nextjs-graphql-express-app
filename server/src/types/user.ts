import { ObjectType, Field } from "type-graphql";
import { User } from "../entities/User";
import { ResponseType } from '../types/index';

@ObjectType()
export class MeResponse extends ResponseType {
  @Field(() => User, { nullable: true, defaultValue: null })
  data?: User;
}

@ObjectType()
export class UsersResponse extends ResponseType {
  @Field(() => [User], { nullable: true, defaultValue: null })
  data?: User[];
}

@ObjectType()
export class registerResponse extends ResponseType {
  @Field(() => User, { nullable: true, defaultValue: null })
  data?: User;
}

@ObjectType()
export class deleteUserResponse extends ResponseType { }

@ObjectType()
export class loginResponse extends ResponseType {
  @Field(() => User, { nullable: true, defaultValue: null })
  data?: User;
}

@ObjectType()
export class logoutResponse extends ResponseType { }







