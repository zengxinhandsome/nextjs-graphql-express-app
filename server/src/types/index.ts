import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from 'express';
import { ObjectType, Field, Int } from "type-graphql";
// import { Post } from "../entities/Post";

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: { userId: number } };
  res: Response;
}

@ObjectType()
export class ResponseType {
  @Field(() => Int, { defaultValue: 0 }) // 0: success
  code?: number;

  @Field(() => String, { defaultValue: 'success' })
  message?: string;
}
