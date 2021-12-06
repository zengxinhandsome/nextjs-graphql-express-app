import { Resolver, Query } from "type-graphql";
import { HelloResponse } from "../types/hello";

@Resolver()
export class HelloResolve {
  @Query(() => HelloResponse)
  hello (): HelloResponse {
    return {
      code: 0,
      message: 'success',
      data: 'hello world'
    }
  }
}