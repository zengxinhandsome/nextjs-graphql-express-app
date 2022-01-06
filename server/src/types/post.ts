import { ObjectType, Field } from 'type-graphql';
import { Post } from '../entities/Post';
import CommonRes from './objectType';

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts?: Post[];
  @Field()
  hasMore?: boolean;
}

@ObjectType()
export class PostsRes extends CommonRes {
  @Field(() => PaginatedPosts, { nullable: true, defaultValue: null })
  data?: {
    posts: Post[];
    hasMore: boolean;
  };
}

@ObjectType()
export class PostRes extends CommonRes {
  @Field(() => Post, { nullable: true, defaultValue: null })
  data?: Post;
}
