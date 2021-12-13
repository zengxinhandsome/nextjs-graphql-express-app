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
    posts() {
        return __awaiter(this, void 0, void 0, function* () {
            const allPosts = yield Post_1.Post.find();
            return {
                code: 0,
                message: 'success',
                data: allPosts
            };
        });
    }
    getPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.Post.findOne(id);
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
    createPost(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = new Post_1.Post();
            post.title = title;
            yield post.save();
            return {
                code: 0,
                message: 'success',
                data: post
            };
        });
    }
    updatePost(id, title) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.Post.findOne(id);
            if (!post) {
                return {
                    code: 1,
                    message: 'can not find this post'
                };
            }
            post.title = title;
            yield post.save();
            return {
                code: 0,
                message: 'success',
                data: post
            };
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.Post.findOne(id);
            if (!post) {
                return {
                    code: 1,
                    message: "can't find this post"
                };
            }
            yield post.remove();
            return {
                code: 0,
                message: 'success'
            };
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => post_1.PostsRes),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostResolve.prototype, "posts", null);
__decorate([
    (0, type_graphql_1.Query)(() => post_1.PostRes),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolve.prototype, "getPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => post_1.PostRes),
    __param(0, (0, type_graphql_1.Arg)("title", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostResolve.prototype, "createPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => post_1.PostRes),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int, { nullable: false })),
    __param(1, (0, type_graphql_1.Arg)("title", () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PostResolve.prototype, "updatePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => post_1.PostRes),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolve.prototype, "deletePost", null);
PostResolve = __decorate([
    (0, type_graphql_1.Resolver)()
], PostResolve);
exports.PostResolve = PostResolve;
