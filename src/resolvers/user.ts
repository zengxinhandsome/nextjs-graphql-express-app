import { Resolver, Mutation, Arg, InputType, Ctx, Field, Query } from "type-graphql";
import { User } from "../entities/User";
import { MyContext } from "../types";
import argon2 from 'argon2';

@InputType()
class UsernamePasswordInput {
  @Field()
  username!: string;
  @Field()
  password!: string;
}

@Resolver()
export class UserResolve {
  @Query(() => [User])
  users (@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {})
  }

  @Mutation(() => User)
  async register (
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ) {
    const user = await em.create(User, { username: options.username, password: options.password });
    await em.persistAndFlush(user);
    return user;
  }
}