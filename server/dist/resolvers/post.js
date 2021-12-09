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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostResolve = void 0;
const type_graphql_1 = require("type-graphql");
const Post_1 = require("../entities/Post");
const post_1 = require("../types/post");
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let PostResolve = class PostResolve {
    posts({ em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield em.find(Post_1.Post, {});
            return {
                code: 0,
                message: 'success',
                data: post
            };
        });
    }
    getPost(id, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield em.findOne(Post_1.Post, { id });
            if (!post) {
                return {
                    code: 1,
                    message: 'can not find this post'
                };
            }
            return {
                code: 0,
                message: 'success',
                data: post
            };
        });
    }
    createPost(title, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = em.create(Post_1.Post, { title });
            yield em.persistAndFlush(post);
            return {
                code: 0,
                message: 'success',
                data: post
            };
        });
    }
    updatePost(id, title, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield em.findOne(Post_1.Post, { id });
            if (!post) {
                return {
                    code: 1,
                    message: 'can not find this post'
                };
            }
            post.title = title;
            yield em.persistAndFlush(post);
            return {
                code: 0,
                message: 'success',
                data: post
            };
        });
    }
    deletePost(id, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield em.nativeDelete(Post_1.Post, { id });
            if (!post) {
                return {
                    code: 1,
                    message: "can't find this post"
                };
            }
            return {
                code: 0,
                message: 'success'
            };
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => post_1.PostsRes),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostResolve.prototype, "posts", null);
__decorate([
    (0, type_graphql_1.Query)(() => post_1.PostRes),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolve.prototype, "getPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => post_1.PostRes),
    __param(0, (0, type_graphql_1.Arg)("title", () => String)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostResolve.prototype, "createPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => post_1.PostRes),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int, { nullable: false })),
    __param(1, (0, type_graphql_1.Arg)("title", () => String, { nullable: true })),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], PostResolve.prototype, "updatePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => post_1.PostRes),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolve.prototype, "deletePost", null);
PostResolve = __decorate([
    (0, type_graphql_1.Resolver)()
], PostResolve);
exports.PostResolve = PostResolve;
