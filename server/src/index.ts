import "reflect-metadata";
import { MikroORM } from '@mikro-orm/core';
import express from 'express';
import http from 'http';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { buildSchema } from 'type-graphql';
import Redis from "ioredis";
import connectRedis from 'connect-redis';
import session from 'express-session';
import cors from 'cors';

import { __prod__ } from './constants';
// import { Post } from './entities/Post';
import config from './mikro-orm.config';
import { HelloResolve } from './resolvers/hello';
import { PostResolve } from "./resolvers/post";
import { UserResolve } from "./resolvers/user";
import { sendEmail } from "./utils/sendEmail";
import { User } from "./entities/User";

const main = async () => {
  const orm = await MikroORM.init(config);
  await orm.getMigrator().up();
  // const post = orm.em.create(Post, { title: 'my first post' });
  // await orm.em.persistAndFlush(post);
  // const posts = await orm.em.find(Post, {});

  const app = express();

  const httpServer = http.createServer(app);

  const RedisStore = connectRedis(session)
  const redis = new Redis(process.env.REDIS_URL);

  app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  }));
  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redis,
        disableTouch: true
      }),
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24,
        secure: __prod__ === 'production' ? true : false
      }
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolve, PostResolve, UserResolve],
      validate: false
    }),
    formatResponse: (response, query) => {
      // const operationName = query.request.operationName
      return response;
      // return {
      //   data: response?.data && operationName && response?.data[operationName] || null
      // }
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground()
    ],
    context: ({ req, res }) => {
      return ({ em: orm.em, req, res, redis })
    }
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false
    // cors: {
    //   credentials: true,
    // },
  });

  httpServer.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`);
  });

}

main().catch(err => console.error(err));