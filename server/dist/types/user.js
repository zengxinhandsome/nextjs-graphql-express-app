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
exports.UsersRes = exports.UserRes = void 0;
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
const objectType_1 = __importDefault(require("./objectType"));
let UserRes = class UserRes extends objectType_1.default {
};
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true, defaultValue: null }),
    __metadata("design:type", User_1.User)
], UserRes.prototype, "data", void 0);
UserRes = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserRes);
exports.UserRes = UserRes;
let UsersRes = class UsersRes extends objectType_1.default {
};
__decorate([
    (0, type_graphql_1.Field)(() => [User_1.User], { nullable: true, defaultValue: null }),
    __metadata("design:type", Array)
], UsersRes.prototype, "data", void 0);
UsersRes = __decorate([
    (0, type_graphql_1.ObjectType)()
], UsersRes);
exports.UsersRes = UsersRes;
