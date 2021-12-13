import { Resolver, Query, Arg, Int, Mutation } from "type-graphql";
import { Post } from "../entities/Post";
import { PostsRes, PostRes } from "../types/post";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

@Resolver()
export class PostResolve {
  @Query(() => PostsRes)
  async posts (): Promise<PostsRes> {
    const allPosts = await Post.find();
    return {
      code: 0,
      message: 'success',
      data: allPosts
    }
  }

  @Query(() => PostRes)
  async getPost (
    @Arg("id", () => Int) id: number
  ): Promise<PostRes> {
    const post = await Post.findOne(id)
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
  ): Promise<PostRes> {
    const post = new Post();
    
    post.title = title;
    await post.save();
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
  ): Promise<PostRes> {
    const post = await Post.findOne(id);
    if (!post) {
      return {
        code: 1,
        message: 'can not find this post'
      }
    }

    post.title = title;
    await post.save();
    return {
      code: 0,
      message: 'success',
      data: post
    }
  }


  @Mutation(() => PostRes)
  async deletePost (
    @Arg("id", () => Int) id: number,
  ): Promise<PostRes> {
    const post = await Post.findOne(id);
    if (!post) {
      return {
        code: 1,
        message: "can't find this post"
      }
    }
    await post.remove();
    return {
      code: 0,
      message: 'success'
    }
  }
}