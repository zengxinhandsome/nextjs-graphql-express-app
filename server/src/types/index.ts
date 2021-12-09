import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from 'express';
import { Redis } from "ioredis";
import { ObjectType, Field, Int } from "type-graphql";
// import { Post } from "../entities/Post";

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: { userId: number } };
  res: Response;
  redis: Redis;
}

