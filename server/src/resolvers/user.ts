import { Resolver, Mutation, Arg, InputType, Ctx, Field, Query, ObjectType } from "type-graphql";
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

@ObjectType()
class ErrorItem {
  @Field()
  field!: string;
  @Field()
  message!: string;
}

@ObjectType()
class LoginResponse {
  @Field(() => User, { nullable: true })
  user?: User

  @Field(() => [ErrorItem], { nullable: true })
  errorList?: ErrorItem[]
}

@Resolver()
export class UserResolve {
  @Query(() => User, { nullable: true })
  async me (@Ctx() { em, req }: MyContext): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }
    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Query(() => [User])
  users (@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {})
  }

  @Mutation(() => User)
  async register (
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ) {
    const user = await em.create(User, {
      username: options.username,
      password: await argon2.hash(options.password)
    });
    await em.persistAndFlush(user);
    return user;
  }

  @Mutation(() => LoginResponse)
  async login (
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<LoginResponse | undefined> {
    const user = await em.findOne(User, { username: options.username });

    if (!user) {
      return {
        errorList: [
          {
            field: 'username',
            message: '找不到此用户'
          }
        ]
      }
    }
    const isPasswordValid = await argon2.verify(user.password, options.password);
    if (!isPasswordValid) {
      return {
        errorList: [
          {
            field: 'password',
            message: '密码错误'
          }
        ]
      }
    }

    try {
      req.session.userId = user.id;
    } catch (error) {
      console.log('error: ', error);
    }

    return {
      user
    };
  }

}