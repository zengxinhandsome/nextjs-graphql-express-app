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
exports.logoutResponse = exports.loginResponse = exports.deleteUserResponse = exports.registerResponse = exports.UsersResponse = exports.MeResponse = void 0;
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
const index_1 = require("../types/index");
let MeResponse = class MeResponse extends index_1.ResponseType {
};
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true, defaultValue: null }),
    __metadata("design:type", User_1.User)
], MeResponse.prototype, "data", void 0);
MeResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], MeResponse);
exports.MeResponse = MeResponse;
let UsersResponse = class UsersResponse extends index_1.ResponseType {
};
__decorate([
    (0, type_graphql_1.Field)(() => [User_1.User], { nullable: true, defaultValue: null }),
    __metadata("design:type", Array)
], UsersResponse.prototype, "data", void 0);
UsersResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UsersResponse);
exports.UsersResponse = UsersResponse;
let registerResponse = class registerResponse extends index_1.ResponseType {
};
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true, defaultValue: null }),
    __metadata("design:type", User_1.User)
], registerResponse.prototype, "data", void 0);
registerResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], registerResponse);
exports.registerResponse = registerResponse;
let deleteUserResponse = class deleteUserResponse extends index_1.ResponseType {
};
deleteUserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], deleteUserResponse);
exports.deleteUserResponse = deleteUserResponse;
let loginResponse = class loginResponse extends index_1.ResponseType {
};
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true, defaultValue: null }),
    __metadata("design:type", User_1.User)
], loginResponse.prototype, "data", void 0);
loginResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], loginResponse);
exports.loginResponse = loginResponse;
let logoutResponse = class logoutResponse extends index_1.ResponseType {
};
logoutResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], logoutResponse);
exports.logoutResponse = logoutResponse;
