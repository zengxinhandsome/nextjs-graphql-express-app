import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

export default {
  entities: [Post, User],
  dbName: 'blog',
  type: 'postgresql',
  password: 'zx1328526673',
  debug: __prod__ !== 'production',
  migrations: {
    path: path.join(__dirname, './migrations'), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
  }
} as Parameters<typeof MikroORM.init>[0];