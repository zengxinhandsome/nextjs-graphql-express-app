import "reflect-metadata";
import { MikroORM } from '@mikro-orm/core';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import config from './mikro-orm.config';
import { HelloResolve } from './resolvers/hello';
import { PostResolve } from "./resolvers/post";
import { UserResolve } from "./resolvers/user";


const main = async () => {
  const orm = await MikroORM.init(config);
  await orm.getMigrator().up();
  // const post = orm.em.create(Post, { title: 'my first post' });
  // await orm.em.persistAndFlush(post);
  // const posts = await orm.em.find(Post, {});

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolve, PostResolve, UserResolve],
      validate: false
    }),
    context: () => ({ em: orm.em })
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('server is start on localhost:4000');
  });

}

main().catch(err => console.error(err));