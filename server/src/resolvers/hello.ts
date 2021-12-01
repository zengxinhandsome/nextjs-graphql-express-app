import { Resolver, Query } from "type-graphql";

@Resolver()
export class HelloResolve {
  @Query(() => String)
  hello () {
    return "hello hhh1212"
  }
}