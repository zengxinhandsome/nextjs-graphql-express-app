import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Post } from '../entities/Post';
import isAuth from '../middleware/isAuth';
import { MyContext } from '../types';
import { PostRes, PostsRes } from '../types/post';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

@InputType()
class PostInput {
  @Field({ nullable: false })
  title!: string;
  @Field({ nullable: false })
  text!: string;
}

@Resolver(of => Post)
export class PostResolve {
  @FieldResolver(() => String)
  textSnippet(@Root() post: Post) {
    return post.text.slice(0, 50);
  }

  @Query(() => PostsRes)
  async posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<PostsRes> {
    // 20 -> 21
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const posts = await getConnection().query(
      `
        select p.*,
        json_build_object(
          'id', u.id,
          'username', u.username,
          'email', u.email,
          'createdAt', u."createdAt",
          'updatedAt', u."updatedAt"
          ) creator
        from post p
        inner join public.user u on u.id = p."creatorId"
        ${cursor ? `where p."createdAt" < $2` : ''}
        order by p."createdAt" DESC
        limit $1
        `,
      replacements
    );

    // const qb = getConnection()
    //   .getRepository(Post)
    //   .createQueryBuilder("p")
    //   .innerJoinAndSelect("p.creator", "u", 'u.id = p."creatorId"')
    //   .orderBy('p."createdAt"', "DESC")
    //   .take(reaLimitPlusOne);

    // if (cursor) {
    //   qb.where('p."createdAt" < :cursor', {
    //     cursor: new Date(parseInt(cursor)),
    //   });
    // }

    // const posts = await qb.getMany();

    return {
      code: 0,
      message: 'success',
      data: {
        posts: posts.slice(0, realLimit),
        hasMore: posts.length === reaLimitPlusOne,
      },
    };
    // const allPosts = await Post.find();
    // return {
    //   code: 0,
    //   message: "success",
    //   data: allPosts,
    // };
  }

  @Query(() => PostRes)
  async getPost(@Arg('id', () => Int) id: number): Promise<PostRes> {
    const post = await Post.findOne(id);
    if (!post) {
      return {
        code: 1,
        message: 'can not find this post',
      };
    }

    return {
      code: 0,
      message: 'success',
      data: post,
    };
  }

  @UseMiddleware(isAuth)
  @Mutation(() => PostRes)
  async createPost(
    @Arg('input', () => PostInput) input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<PostRes> {
    const newPost = await Post.create({
      title: input.title,
      text: input.text,
      creatorId: req.session.userId,
    }).save();

    return {
      code: 0,
      message: 'success',
      data: newPost,
    };
  }

  @Mutation(() => PostRes)
  async updatePost(
    @Arg('id', () => Int, { nullable: false }) id: number,
    @Arg('title', () => String, { nullable: true }) title: string
  ): Promise<PostRes> {
    const post = await Post.findOne(id);
    if (!post) {
      return {
        code: 1,
        message: 'can not find this post',
      };
    }

    post.title = title;
    await post.save();
    return {
      code: 0,
      message: 'success',
      data: post,
    };
  }

  @Mutation(() => PostRes)
  async deletePost(@Arg('id', () => Int) id: number): Promise<PostRes> {
    const post = await Post.findOne(id);
    if (!post) {
      return {
        code: 1,
        message: "can't find this post",
      };
    }
    await post.remove();
    return {
      code: 0,
      message: 'success',
    };
  }
}
