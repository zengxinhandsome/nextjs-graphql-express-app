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
exports.UserResolve = void 0;
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const User_1 = require("../entities/User");
const user_1 = require("../types/user");
const constants_1 = require("../constants");
let UsernamePasswordInput = class UsernamePasswordInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "password", void 0);
UsernamePasswordInput = __decorate([
    (0, type_graphql_1.InputType)()
], UsernamePasswordInput);
let ErrorItem = class ErrorItem {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ErrorItem.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ErrorItem.prototype, "message", void 0);
ErrorItem = __decorate([
    (0, type_graphql_1.ObjectType)()
], ErrorItem);
let LoginResponse = class LoginResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], LoginResponse.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [ErrorItem], { nullable: true }),
    __metadata("design:type", Array)
], LoginResponse.prototype, "errorList", void 0);
LoginResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], LoginResponse);
let UserResolve = class UserResolve {
    me({ em, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.findOne(User_1.User, { id: req.session.userId });
            if (!user) {
                return {
                    code: 1,
                    message: '当前未登录'
                };
            }
            return {
                code: 0,
                message: 'success',
                data: user
            };
        });
    }
    users({ em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield em.find(User_1.User, {});
            return {
                code: 0,
                message: 'success',
                data: users
            };
        });
    }
    register(options, { em, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.findOne(User_1.User, { username: options.username });
            if (!user) {
                if (options.username.length < 5) {
                    return {
                        code: 1,
                        message: '用户名不得少于五位'
                    };
                }
                if (options.password.length < 5) {
                    return {
                        code: 1,
                        message: '密码不得少于五位'
                    };
                }
                const newUser = yield em.create(User_1.User, {
                    username: options.username,
                    password: yield argon2_1.default.hash(options.password)
                });
                yield em.persistAndFlush(newUser);
                const userInfo = yield em.findOne(User_1.User, { username: newUser.username });
                if (userInfo) {
                    req.session.userId = userInfo.id;
                }
                return {
                    code: 0,
                    message: 'success',
                    data: newUser
                };
            }
            return {
                code: 1,
                message: '该用户已存在'
            };
        });
    }
    deleteUser(username, { em, req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.findOne(User_1.User, { username });
            if (!user) {
                return {
                    code: 1,
                    message: '该用户不存在'
                };
            }
            yield em.removeAndFlush(user);
            // req.session.destroy(err => {
            //   res.clearCookie('qid');
            // });
            return {
                message: '删除成功'
            };
        });
    }
    login(options, { em, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.findOne(User_1.User, { username: options.username });
            if (!user) {
                return {
                    code: 1,
                    message: '找不到此用户'
                };
            }
            const isPasswordValid = yield argon2_1.default.verify(user.password, options.password);
            if (!isPasswordValid) {
                return {
                    code: 1,
                    message: '密码错误'
                };
            }
            req.session.userId = user.id;
            return {
                code: 0,
                message: 'success',
                data: user
            };
        });
    }
    logout({ req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise(resolve => {
                req.session.destroy(err => {
                    res.clearCookie(constants_1.COOKIE_NAME);
                    if (err) {
                        resolve({
                            code: 1,
                            message: err
                        });
                    }
                    resolve({
                        message: 'success',
                        code: 0
                    });
                });
            });
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => user_1.MeResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolve.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Query)(() => user_1.UsersResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolve.prototype, "users", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => user_1.registerResponse),
    __param(0, (0, type_graphql_1.Arg)('options')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolve.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => user_1.deleteUserResponse),
    __param(0, (0, type_graphql_1.Arg)('username')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolve.prototype, "deleteUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => user_1.loginResponse),
    __param(0, (0, type_graphql_1.Arg)('options')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolve.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => user_1.logoutResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolve.prototype, "logout", null);
UserResolve = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolve);
exports.UserResolve = UserResolve;
