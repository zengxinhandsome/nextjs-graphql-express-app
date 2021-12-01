"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@mikro-orm/core");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const apollo_server_express_1 = require("apollo-server-express");
const apollo_server_core_1 = require("apollo-server-core");
const type_graphql_1 = require("type-graphql");
const ioredis_1 = __importDefault(require("ioredis"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const express_session_1 = __importDefault(require("express-session"));
const constants_1 = require("./constants");
// import { Post } from './entities/Post';
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const hello_1 = require("./resolvers/hello");
const post_1 = require("./resolvers/post");
const user_1 = require("./resolvers/user");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const orm = yield core_1.MikroORM.init(mikro_orm_config_1.default);
    yield orm.getMigrator().up();
    // const post = orm.em.create(Post, { title: 'my first post' });
    // await orm.em.persistAndFlush(post);
    // const posts = await orm.em.find(Post, {});
    const app = (0, express_1.default)();
    const httpServer = http_1.default.createServer(app);
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    const redis = new ioredis_1.default(process.env.REDIS_URL);
    app.use((0, express_session_1.default)({
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
            secure: constants_1.__prod__ === 'production' ? true : false
        }
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield (0, type_graphql_1.buildSchema)({
            resolvers: [hello_1.HelloResolve, post_1.PostResolve, user_1.UserResolve],
            validate: false
        }),
        plugins: [
            (0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
            (0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)()
        ],
        context: ({ req, res }) => ({ em: orm.em, req, res })
    });
    yield apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: {
            credentials: true,
        },
    });
    httpServer.listen({ port: 4000 }, () => {
        console.log(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`);
    });
});
main().catch(err => console.error(err));
