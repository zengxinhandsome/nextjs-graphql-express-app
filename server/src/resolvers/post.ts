import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types";

@Resolver()
export class PostResolve {
  @Query(() => [Post])
  posts (@Ctx() { em }: MyContext): Promise<Post[]> {
    // return "post"
    return em.find(Post, {})
  }

  @Query(() => Post, { nullable: true })
  post (
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return em.findOne(Post, { id })
  }

  @Mutation(() => Post)
  async createPost (
    @Arg("title", () => String) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost (
    @Arg("id", () => Int, { nullable: false }) id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null
    } else {
      post.title = title;
      await em.persistAndFlush(post);
      return post;
    }
  }


  @Mutation(() => Boolean)
  async deletePost (
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    await em.nativeDelete(Post, { id });
    return true;
  }
}