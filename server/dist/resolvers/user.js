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
const argon2_1 = __importDefault(require("argon2"));
const type_graphql_1 = require("type-graphql");
const uuid_1 = require("uuid");
const constants_1 = require("../constants");
const User_1 = require("../entities/User");
const objectType_1 = __importDefault(require("../types/objectType"));
const user_1 = require("../types/user");
const sendEmail_1 = require("../utils/sendEmail");
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
let UserResolve = class UserResolve {
    forgotPassword(email, { redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ email });
            if (!user) {
                return {
                    code: 1,
                    message: '该邮箱未注册'
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
    changePassword(token, newPassword, { redis, req }) {
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
            const user = yield User_1.User.findOne(Number(userId));
            if (!user) {
                return {
                    code: 1,
                    message: "用户不存在"
                };
            }
            const hashPassword = yield argon2_1.default.hash(newPassword);
            user.password = hashPassword;
            yield user.save();
            redis.del(key);
            req.session.userId = user.id;
            return {
                code: 0,
                message: '设置成功',
                data: user
            };
        });
    }
    me({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            // if (!req.session.userId) {
            //   return {
            //     code: 1,
            //     message: '当前未登录'
            //   };
            // }
            // const user = await User.findOne(req.session.userId);
            // if (!user) {
            //   return {
            //     code: 1,
            //     message: '当前未登录'
            //   };
            // }
            // return {
            //   code: 0,
            //   message: 'success',
            //   data: user
            // };
            const errorReturn = {
                code: 1
            };
            if (req.session.userId) {
                const user = yield User_1.User.findOne(req.session.userId);
                if (user) {
                    return {
                        code: 0,
                        message: 'success',
                        data: user
                    };
                }
                return errorReturn;
            }
            return errorReturn;
        });
    }
    users() {
        return __awaiter(this, void 0, void 0, function* () {
            const allUsers = yield User_1.User.find();
            return {
                code: 0,
                message: 'success',
                data: allUsers
            };
        });
    }
    register(options, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ username: options.username });
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
                const newUser = new User_1.User();
                newUser.username = options.username;
                newUser.password = yield argon2_1.default.hash(options.password);
                newUser.email = options.email;
                yield newUser.save();
                req.session.userId = newUser.id;
                return {
                    code: 0,
                    message: 'success',
                    data: newUser
                };
            }
            return {
                code: 1,
                data: user,
                message: '该用户已存在'
            };
        });
    }
    deleteUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ username });
            if (!user) {
                return {
                    code: 1,
                    message: '该用户不存在'
                };
            }
            yield user.remove();
            return {
                message: '删除成功'
            };
        });
    }
    login(usernameOrEmail, password, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne(usernameOrEmail.includes('@')
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
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
