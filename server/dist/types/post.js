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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostResponse = exports.updatePostResponse = exports.createPostResponse = exports.getPostResponse = exports.postResponse = void 0;
const type_graphql_1 = require("type-graphql");
const Post_1 = require("../entities/Post");
const index_1 = require("../types/index");
let postResponse = class postResponse extends index_1.ResponseType {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Post_1.Post], { nullable: true, defaultValue: null }),
    __metadata("design:type", Array)
], postResponse.prototype, "data", void 0);
postResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], postResponse);
exports.postResponse = postResponse;
let getPostResponse = class getPostResponse extends index_1.ResponseType {
};
__decorate([
    (0, type_graphql_1.Field)(() => Post_1.Post, { nullable: true, defaultValue: null }),
    __metadata("design:type", Post_1.Post)
], getPostResponse.prototype, "data", void 0);
getPostResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], getPostResponse);
exports.getPostResponse = getPostResponse;
let createPostResponse = class createPostResponse extends index_1.ResponseType {
};
__decorate([
    (0, type_graphql_1.Field)(() => Post_1.Post, { nullable: true, defaultValue: null }),
    __metadata("design:type", Post_1.Post)
], createPostResponse.prototype, "data", void 0);
createPostResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], createPostResponse);
exports.createPostResponse = createPostResponse;
let updatePostResponse = class updatePostResponse extends index_1.ResponseType {
};
__decorate([
    (0, type_graphql_1.Field)(() => Post_1.Post, { nullable: true, defaultValue: null }),
    __metadata("design:type", Post_1.Post)
], updatePostResponse.prototype, "data", void 0);
updatePostResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], updatePostResponse);
exports.updatePostResponse = updatePostResponse;
let deletePostResponse = class deletePostResponse extends index_1.ResponseType {
};
deletePostResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], deletePostResponse);
exports.deletePostResponse = deletePostResponse;
