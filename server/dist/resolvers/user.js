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
const uuid_1 = require("uuid");
const User_1 = require("../entities/User");
const user_1 = require("../types/user");
const constants_1 = require("../constants");
const sendEmail_1 = require("../utils/sendEmail");
const objectType_1 = __importDefault(require("../types/objectType"));
let UsernamePasswordInput = class UsernamePasswordInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "email", void 0);
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
// @ObjectType()
// class CommonRes {
//   @Field(() => Int, { defaultValue: 0 }) // 0: success
//   code?: number;
//   @Field(() => String, { defaultValue: 'success' })
//   message?: string;
// }
let UserResolve = class UserResolve {
    forgotPassword(email, { em, redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.findOne(User_1.User, { email });
            if (!user) {
                return {
                    code: 1,
                    message: 'error'
                };
            }
            const token = (0, uuid_1.v4)();
            yield redis.set(constants_1.FORGOT_PASSWORD_PREFIX + token, user.id, "ex", 1000 * 60 * 60 * 24 * 3); // 3 days
            yield (0, sendEmail_1.sendEmail)(email, `<a href="http://localhost:3000/change-password/${token}">reset password</a>`);
            return {
                code: 0,
                message: 'success'
            };
        });
    }
    changePassword(token, newPassword, { em, redis, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (newPassword.length < 5) {
                return {
                    code: 1,
                    message: '密码不得少于五位'
                };
            }
            const key = constants_1.FORGOT_PASSWORD_PREFIX + token;
            const userId = yield redis.get(key);
            if (!userId) {
                return {
                    code: 1,
                    message: "无效的 token"
                };
            }
            const user = yield em.findOne(User_1.User, { id: Number(userId) });
            if (!user) {
                return {
                    code: 1,
                    message: "用户不存在"
                };
            }
            const hashPassword = yield argon2_1.default.hash(newPassword);
            user.password = hashPassword;
            redis.del(key);
            req.session.userId = user.id;
            yield em.persistAndFlush(user);
            return {
                code: 0,
                message: '设置成功',
                data: user
            };
        });
    }
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
                if (!options.email.includes('@')) {
                    return {
                        code: 1,
                        message: '请输入正确的邮箱'
                    };
                }
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
                    password: yield argon2_1.default.hash(options.password),
                    email: options.email
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
    login(usernameOrEmail, password, { em, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.findOne(User_1.User, usernameOrEmail.includes('@')
                ? { email: usernameOrEmail }
                : { username: usernameOrEmail });
            if (!user) {
                return {
                    code: 1,
                    message: '用户名或密码错误'
                };
            }
            const isPasswordValid = yield argon2_1.default.verify(user.password, password);
            if (!isPasswordValid) {
                return {
                    code: 1,
                    message: '用户名或密码错误'
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
    (0, type_graphql_1.Mutation)(() => objectType_1.default),
    __param(0, (0, type_graphql_1.Arg)('email')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolve.prototype, "forgotPassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => user_1.UserRes),
    __param(0, (0, type_graphql_1.Arg)('token')),
    __param(1, (0, type_graphql_1.Arg)('newPassword')),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolve.prototype, "changePassword", null);
__decorate([
    (0, type_graphql_1.Query)(() => user_1.UserRes),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolve.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Query)(() => user_1.UsersRes),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolve.prototype, "users", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => user_1.UserRes),
    __param(0, (0, type_graphql_1.Arg)('options')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolve.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => objectType_1.default),
    __param(0, (0, type_graphql_1.Arg)('username')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolve.prototype, "deleteUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => user_1.UserRes),
    __param(0, (0, type_graphql_1.Arg)('usernameOrEmail')),
    __param(1, (0, type_graphql_1.Arg)('password')),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolve.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => objectType_1.default),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolve.prototype, "logout", null);
UserResolve = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolve);
exports.UserResolve = UserResolve;
