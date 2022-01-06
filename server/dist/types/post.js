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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRes = exports.PostsRes = void 0;
const type_graphql_1 = require("type-graphql");
const Post_1 = require("../entities/Post");
const objectType_1 = __importDefault(require("./objectType"));
let PaginatedPosts = class PaginatedPosts {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Post_1.Post]),
    __metadata("design:type", Array)
], PaginatedPosts.prototype, "posts", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PaginatedPosts.prototype, "hasMore", void 0);
PaginatedPosts = __decorate([
    (0, type_graphql_1.ObjectType)()
], PaginatedPosts);
let PostsRes = class PostsRes extends objectType_1.default {
};
__decorate([
    (0, type_graphql_1.Field)(() => PaginatedPosts, { nullable: true, defaultValue: null }),
    __metadata("design:type", Object)
], PostsRes.prototype, "data", void 0);
PostsRes = __decorate([
    (0, type_graphql_1.ObjectType)()
], PostsRes);
exports.PostsRes = PostsRes;
let PostRes = class PostRes extends objectType_1.default {
};
__decorate([
    (0, type_graphql_1.Field)(() => Post_1.Post, { nullable: true, defaultValue: null }),
    __metadata("design:type", Post_1.Post)
], PostRes.prototype, "data", void 0);
PostRes = __decorate([
    (0, type_graphql_1.ObjectType)()
], PostRes);
exports.PostRes = PostRes;
