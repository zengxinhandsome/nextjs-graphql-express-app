import argon2 from 'argon2';
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { v4 as uuidv4 } from 'uuid';
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from "../constants";
import { User } from "../entities/User";
import { MyContext } from "../types";
import CommonRes from "../types/objectType";
import { UserRes, UsersRes } from "../types/user";
import { sendEmail } from "../utils/sendEmail";

@InputType()
class UsernamePasswordInput {
  @Field()
  email!: string;
  @Field()
  username!: string;
  @Field()
  password!: string;
}

@Resolver()
export class UserResolve {
  @Mutation(() => CommonRes)
  async forgotPassword (
    @Arg('email') email: string,
    @Ctx() { redis }: MyContext
  ): Promise<CommonRes> {
    const user = await User.findOne({ email });

    if (!user) {
      return {
        code: 1,
        message: '该邮箱未注册'
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
    @Ctx() { redis, req }: MyContext
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

    const user = await User.findOne(Number(userId));

    if (!user) {
      return {
        code: 1,
        message: "用户不存在"
      }
    }

    const hashPassword = await argon2.hash(newPassword);

    user.password = hashPassword;
    await user.save();

    redis.del(key);
    req.session.userId = user.id;

    return {
      code: 0,
      message: '设置成功',
      data: user
    }
  }

  @Query(() => UserRes)
  async me (
    @Ctx() { req }: MyContext
  ): Promise<UserRes> {
    // if (!req.session.userId) {
    //   return {
    //     code: 1,
    //     message: '当前未登录'
    //   };
    // }
    // const user = await User.findOne(req.session.userId);
    // if (!user) {
    //   return {
    //     code: 1,
    //     message: '当前未登录'
    //   };
    // }
    // return {
    //   code: 0,
    //   message: 'success',
    //   data: user
    // };

    const errorReturn = {
      code: 1
    }

    if (req.session.userId) {
      const user = await User.findOne(req.session.userId);
      if (user) {
        return {
          code: 0,
          message: 'success',
          data: user
        };
      }
      return errorReturn;
    }
    return errorReturn;
  }

  @Query(() => UsersRes)
  async users (): Promise<UsersRes> {
    const allUsers = await User.find();
    return {
      code: 0,
      message: 'success',
      data: allUsers
    }
  }

  @Mutation(() => UserRes)
  async register (
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserRes> {
    const user = await User.findOne({ username: options.username });
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

      const newUser = new User();

      newUser.username = options.username;
      newUser.password = await argon2.hash(options.password);
      newUser.email = options.email;
      await newUser.save();

      req.session.userId = newUser.id;

      return {
        code: 0,
        message: 'success',
        data: newUser
      };
    }
    return {
      code: 1,
      data: user,
      message: '该用户已存在'
    };
  }


  @Mutation(() => CommonRes)
  async deleteUser (
    @Arg('username') username: string
  ): Promise<CommonRes> {
    const user = await User.findOne({ username });
    if (!user) {
      return {
        code: 1,
        message: '该用户不存在'
      };
    }
    await user.remove();
    return {
      message: '删除成功'
    }
  }

  @Mutation(() => UserRes)
  async login (
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserRes> {
    const user = await User.findOne(
      usernameOrEmail.includes('@')
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
    );

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