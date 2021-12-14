import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types";

const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.req.session.userId) {
    return {
      code: 1,
      message: '当前未登录'
    }
  }
  return await next();
};

export default isAuth;