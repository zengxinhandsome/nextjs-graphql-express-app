import { Resolver, Query, Arg, Int, Mutation, InputType, Field, Ctx, UseMiddleware } from "type-graphql";
import { Post } from "../entities/Post";
import isAuth from "../middleware/isAuth";
import { MyContext } from "../types";
import { PostsRes, PostRes } from "../types/post";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

@InputType()
class PostInput {
  @Field({ nullable: false })
  title!: string;
  @Field({ nullable: false })
  text!: string;
}

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

  @UseMiddleware(isAuth)
  @Mutation(() => PostRes)
  async createPost (
    @Arg("input", () => PostInput) input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<PostRes> {
    const newPost = await Post.create({
      title: input.title,
      text: input.text,
      creatorId: req.session.userId
    }).save();

    return {
      code: 0,
      message: 'success',
      data: newPost
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