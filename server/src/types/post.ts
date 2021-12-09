import { ObjectType, Field } from "type-graphql";
import { Post } from "../entities/Post";
import CommonRes from "./objectType";

@ObjectType()
export class PostsRes extends CommonRes {
  @Field(() => [Post], { nullable: true, defaultValue: null })
  data?: Post[];
}

@ObjectType()
export class PostRes extends CommonRes {
  @Field(() => Post, { nullable: true, defaultValue: null })
  data?: Post;
}
