import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext, ResponseType } from "../types";
import { createPostResponse, deletePostResponse, getPostResponse, postResponse, updatePostResponse } from "../types/post";

@Resolver()
export class PostResolve {
  @Query(() => postResponse)
  async posts (@Ctx() { em }: MyContext): Promise<postResponse> {
    const post = await em.find(Post, {});
    return {
      code: 0,
      message: 'success',
      data: post
    }
  }

  @Query(() => getPostResponse)
  async getPost (
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<getPostResponse> {
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

  @Mutation(() => createPostResponse)
  async createPost (
    @Arg("title", () => String) title: string,
    @Ctx() { em }: MyContext
  ): Promise<createPostResponse> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return {
      code: 0,
      message: 'success',
      data: post
    }
  }

  @Mutation(() => updatePostResponse)
  async updatePost (
    @Arg("id", () => Int, { nullable: false }) id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<updatePostResponse> {
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


  @Mutation(() => deletePostResponse)
  async deletePost (
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<deletePostResponse> {
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