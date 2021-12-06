import { ObjectType, Field } from "type-graphql";
import { Post } from "../entities/Post";
import { ResponseType } from '../types/index';

@ObjectType()
export class postResponse extends ResponseType {
  @Field(() => [Post], { nullable: true, defaultValue: null })
  data?: Post[];
}

@ObjectType()
export class getPostResponse extends ResponseType {
  @Field(() => Post, { nullable: true, defaultValue: null })
  data?: Post;
}

@ObjectType()
export class createPostResponse extends ResponseType {
  @Field(() => Post, { nullable: true, defaultValue: null })
  data?: Post;
}

@ObjectType()
export class updatePostResponse extends ResponseType {
  @Field(() => Post, { nullable: true, defaultValue: null })
  data?: Post;
}

@ObjectType()
export class deletePostResponse extends ResponseType { }
