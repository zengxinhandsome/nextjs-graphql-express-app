import { Resolver, Mutation, Arg, InputType, Ctx, Field, Query, ObjectType, Int } from "type-graphql";
import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { User } from "../entities/User";
import { MyContext } from "../types";
import { UserRes, UsersRes } from "../types/user";
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from "../constants";
import { sendEmail } from "../utils/sendEmail";
import CommonRes from "../types/objectType";

@InputType()
class UsernamePasswordInput {
  @Field()
  email!: string;
  @Field()
  username!: string;
  @Field()
  password!: string;
}

// @ObjectType()
// class CommonRes {
//   @Field(() => Int, { defaultValue: 0 }) // 0: success
//   code?: number;

//   @Field(() => String, { defaultValue: 'success' })
//   message?: string;
// }

@Resolver()
export class UserResolve {
  @Mutation(() => CommonRes)
  async forgotPassword (
    @Arg('email') email: string,
    @Ctx() { em, redis }: MyContext
  ): Promise<CommonRes> {
    const user = await em.findOne(User, { email });
    if (!user) {
      return {
        code: 1,
        message: 'error'
      }
    }

    const token = uuidv4();

    await redis.set(
      FORGOT_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    ); // 3 days

    await sendEmail(email, `<a href="http://localhost:3000/change-password/${token}">reset password</a>`);
    return {
      code: 0,
      message: 'success'
    }
  }

  @Mutation(() => UserRes)
  async changePassword (
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { em, redis, req }: MyContext
  ): Promise<UserRes> {
    if (newPassword.length < 5) {
      return {
        code: 1,
        message: '密码不得少于五位'
      }
    }

    const key = FORGOT_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);

    if (!userId) {
      return {
        code: 1,
        message: "无效的 token"
      }
    }

    const user = await em.findOne(User, { id: Number(userId) });

    if (!user) {
      return {
        code: 1,
        message: "用户不存在"
      }
    }

    const hashPassword = await argon2.hash(newPassword);

    user.password = hashPassword;

    redis.del(key);

    req.session.userId = user.id;

    await em.persistAndFlush(user);

    return {
      code: 0,
      message: '设置成功',
      data: user
    }
  }

  @Query(() => UserRes)
  async me (@Ctx() { em, req }: MyContext): Promise<UserRes> {
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

  @Query(() => UsersRes)
  async users (@Ctx() { em }: MyContext): Promise<UsersRes> {
    const users = await em.find(User, {});
    return {
      code: 0,
      message: 'success',
      data: users
    }
  }

  @Mutation(() => UserRes)
  async register (
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserRes> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      if (!options.email.includes('@')) {
        return {
          code: 1,
          message: '请输入正确的邮箱'
        }
      }

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
        password: await argon2.hash(options.password),
        email: options.email
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


  @Mutation(() => CommonRes)
  async deleteUser (
    @Arg('username') username: string,
    @Ctx() { em, req, res }: MyContext
  ): Promise<CommonRes> {
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

  @Mutation(() => UserRes)
  async login (
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { em, req }: MyContext
  ): Promise<UserRes> {
    const user = await em.findOne(User,
      usernameOrEmail.includes('@')
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail });

    if (!user) {
      return {
        code: 1,
        message: '用户名或密码错误'
      }
    }
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return {
        code: 1,
        message: '用户名或密码错误'
      }
    }

    req.session.userId = user.id;

    return {
      code: 0,
      message: 'success',
      data: user
    };
  }

  @Mutation(() => CommonRes)
  async logout (
    @Ctx() { req, res }: MyContext
  ): Promise<CommonRes> {
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