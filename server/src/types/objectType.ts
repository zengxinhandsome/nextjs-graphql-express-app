import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
class CommonRes {
  @Field(() => Int, { defaultValue: 0 }) // 0: success
  code?: number;

  @Field(() => String, { defaultValue: 'success' })
  message?: string;
}

export default CommonRes;