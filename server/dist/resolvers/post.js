"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.PostResolve = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Post_1 = require("../entities/Post");
const isAuth_1 = __importDefault(require("../middleware/isAuth"));
const post_1 = require("../types/post");
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let PostInput = class PostInput {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: false }),
    __metadata("design:type", String)
], PostInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: false }),
    __metadata("design:type", String)
], PostInput.prototype, "text", void 0);
PostInput = __decorate([
    (0, type_graphql_1.InputType)()
], PostInput);
let PostResolve = class PostResolve {
    textSnippet(post) {
        return post.text.slice(0, 50);
    }
    posts(limit, cursor) {
        return __awaiter(this, void 0, void 0, function* () {
            // 20 -> 21
            const realLimit = Math.min(50, limit);
            const reaLimitPlusOne = realLimit + 1;
            const replacements = [reaLimitPlusOne];
            if (cursor) {
                replacements.push(new Date(parseInt(cursor)));
            }
            const posts = yield (0, typeorm_1.getConnection)().query(`
        select p.*,
        json_build_object(
          'id', u.id,
          'username', u.username,
          'email', u.email,
          'createdAt', u."createdAt",
          'updatedAt', u."updatedAt"
          ) creator
        from post p
        inner join public.user u on u.id = p."creatorId"
        ${cursor ? `where p."createdAt" < $2` : ''}
        order by p."createdAt" DESC
        limit $1
        `, replacements);
            // const qb = getConnection()
            //   .getRepository(Post)
            //   .createQueryBuilder("p")
            //   .innerJoinAndSelect("p.creator", "u", 'u.id = p."creatorId"')
            //   .orderBy('p."createdAt"', "DESC")
            //   .take(reaLimitPlusOne);
            // if (cursor) {
            //   qb.where('p."createdAt" < :cursor', {
            //     cursor: new Date(parseInt(cursor)),
            //   });
            // }
            // const posts = await qb.getMany();
            return {
                code: 0,
                message: 'success',
                data: {
                    posts: posts.slice(0, realLimit),
                    hasMore: posts.length === reaLimitPlusOne,
                },
            };
            // const allPosts = await Post.find();
            // return {
            //   code: 0,
            //   message: "success",
            //   data: allPosts,
            // };
        });
    }
    getPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.Post.findOne(id);
            if (!post) {
                return {
                    code: 1,
                    message: 'can not find this post',
                };
            }
            return {
                code: 0,
                message: 'success',
                data: post,
            };
        });
    }
    createPost(input, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPost = yield Post_1.Post.create({
                title: input.title,
                text: input.text,
                creatorId: req.session.userId,
            }).save();
            return {
                code: 0,
                message: 'success',
                data: newPost,
            };
        });
    }
    updatePost(id, title) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.Post.findOne(id);
            if (!post) {
                return {
                    code: 1,
                    message: 'can not find this post',
                };
            }
            post.title = title;
            yield post.save();
            return {
                code: 0,
                message: 'success',
                data: post,
            };
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.Post.findOne(id);
            if (!post) {
                return {
                    code: 1,
                    message: "can't find this post",
                };
            }
            yield post.remove();
            return {
                code: 0,
                message: 'success',
            };
        });
    }
};
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post]),
    __metadata("design:returntype", void 0)
], PostResolve.prototype, "textSnippet", null);
__decorate([
    (0, type_graphql_1.Query)(() => post_1.PostsRes),
    __param(0, (0, type_graphql_1.Arg)('limit', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)('cursor', () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolve.prototype, "posts", null);
__decorate([
    (0, type_graphql_1.Query)(() => post_1.PostRes),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolve.prototype, "getPost", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(isAuth_1.default),
    (0, type_graphql_1.Mutation)(() => post_1.PostRes),
    __param(0, (0, type_graphql_1.Arg)('input', () => PostInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PostInput, Object]),
    __metadata("design:returntype", Promise)
], PostResolve.prototype, "createPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => post_1.PostRes),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int, { nullable: false })),
    __param(1, (0, type_graphql_1.Arg)('title', () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PostResolve.prototype, "updatePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => post_1.PostRes),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolve.prototype, "deletePost", null);
PostResolve = __decorate([
    (0, type_graphql_1.Resolver)(of => Post_1.Post)
], PostResolve);
exports.PostResolve = PostResolve;
