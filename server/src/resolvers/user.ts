import { Resolver, Mutation, Arg, InputType, Ctx, Field, Query, ObjectType } from "type-graphql";
import argon2 from 'argon2';
import { User } from "../entities/User";
import { MyContext, ResponseType } from "../types";
import { deleteUserResponse, loginResponse, logoutResponse, MeResponse, registerResponse, UsersResponse } from "../types/user";
import { MikroORM } from "@mikro-orm/core";
import { COOKIE_NAME } from "../constants";

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
  @Query(() => MeResponse)
  async me (@Ctx() { em, req }: MyContext): Promise<MeResponse> {
    const user = await em.findOne(User, { id: req.session.userId });
    if (!user) {
      return {
        code: 1,
        message: '当前未登录'
      };
    }
    return {
      code: 0,
      message: 'success',
      data: user
    };
  }

  @Query(() => UsersResponse)
  async users (@Ctx() { em }: MyContext): Promise<UsersResponse> {
    const users = await em.find(User, {});
    return {
      code: 0,
      message: 'success',
      data: users
    }
  }

  @Mutation(() => registerResponse)
  async register (
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<registerResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      if (options.username.length < 5) {
        return {
          code: 1,
          message: '用户名不得少于五位'
        }
      }
      if (options.password.length < 5) {
        return {
          code: 1,
          message: '密码不得少于五位'
        }
      }
      const newUser = await em.create(User, {
        username: options.username,
        password: await argon2.hash(options.password)
      });

      await em.persistAndFlush(newUser);

      const userInfo = await em.findOne(User, { username: newUser.username });

      if (userInfo) {
        req.session.userId = userInfo.id;
      }

      return {
        code: 0,
        message: 'success',
        data: newUser
      };
    }
    return {
      code: 1,
      message: '该用户已存在'
    };
  }


  @Mutation(() => deleteUserResponse)
  async deleteUser (
    @Arg('username') username: string,
    @Ctx() { em, req, res }: MyContext
  ): Promise<deleteUserResponse> {
    const user = await em.findOne(User, { username });
    if (!user) {
      return {
        code: 1,
        message: '该用户不存在'
      };
    }
    await em.removeAndFlush(user);
    // req.session.destroy(err => {
    //   res.clearCookie('qid');
    // });
    return {
      message: '删除成功'
    }
  }

  @Mutation(() => loginResponse)
  async login (
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<loginResponse> {
    const user = await em.findOne(User, { username: options.username });

    if (!user) {
      return {
        code: 1,
        message: '找不到此用户'
      }
    }
    const isPasswordValid = await argon2.verify(user.password, options.password);
    if (!isPasswordValid) {
      return {
        code: 1,
        message: '密码错误'
      }
    }

    req.session.userId = user.id;

    return {
      code: 0,
      message: 'success',
      data: user
    };
  }

  @Mutation(() => logoutResponse)
  async logout (
    @Ctx() { req, res }: MyContext
  ): Promise<logoutResponse> {
    return await new Promise(resolve => {
      req.session.destroy(err => {
        res.clearCookie(COOKIE_NAME)
        if (err) {
          resolve({
            code: 1,
            message: err
          })
        }
        resolve({
          message: 'success',
          code: 0
        })
      });
    })
  }
}