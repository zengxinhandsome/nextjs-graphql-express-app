import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { PostsRes, PostRes } from "../types/post";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

@Resolver()
export class PostResolve {
  @Query(() => PostsRes)
  async posts (@Ctx() { em }: MyContext): Promise<PostsRes> {
    const post = await em.find(Post, {});
    return {
      code: 0,
      message: 'success',
      data: post
    }
  }

  @Query(() => PostRes)
  async getPost (
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<PostRes> {
    const post = await em.findOne(Post, { id });
    if (!post) {
      return {
        code: 1,
        message: 'can not find this post'
      };
    }

    return {
      code: 0,
      message: 'success',
      data: post
    }
  }

  @Mutation(() => PostRes)
  async createPost (
    @Arg("title", () => String) title: string,
    @Ctx() { em }: MyContext
  ): Promise<PostRes> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return {
      code: 0,
      message: 'success',
      data: post
    }
  }

  @Mutation(() => PostRes)
  async updatePost (
    @Arg("id", () => Int, { nullable: false }) id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<PostRes> {
    const post = await em.findOne(Post, { id });
    if (!post) {
      return {
        code: 1,
        message: 'can not find this post'
      }
    }

    post.title = title;
    await em.persistAndFlush(post);
    return {
      code: 0,
      message: 'success',
      data: post
    }
  }


  @Mutation(() => PostRes)
  async deletePost (
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<PostRes> {
    const post = await em.nativeDelete(Post, { id });
    if (!post) {
      return {
        code: 1,
        message: "can't find this post"
      }
    }
    return {
      code: 0,
      message: 'success'
    }
  }
}