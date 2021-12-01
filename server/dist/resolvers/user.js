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
const User_1 = require("../entities/User");
const argon2_1 = __importDefault(require("argon2"));
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
            if (!req.session.userId) {
                return null;
            }
            const user = yield em.findOne(User_1.User, { id: req.session.userId });
            return user;
        });
    }
    users({ em }) {
        return em.find(User_1.User, {});
    }
    register(options, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.create(User_1.User, {
                username: options.username,
                password: yield argon2_1.default.hash(options.password)
            });
            yield em.persistAndFlush(user);
            return user;
        });
    }
    login(options, { em, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.findOne(User_1.User, { username: options.username });
            if (!user) {
                return {
                    errorList: [
                        {
                            field: 'username',
                            message: '找不到此用户'
                        }
                    ]
                };
            }
            const isPasswordValid = yield argon2_1.default.verify(user.password, options.password);
            if (!isPasswordValid) {
                return {
                    errorList: [
                        {
                            field: 'password',
                            message: '密码错误'
                        }
                    ]
                };
            }
            try {
                req.session.userId = user.id;
            }
            catch (error) {
                console.log('error: ', error);
            }
            return {
                user
            };
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolve.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Query)(() => [User_1.User]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolve.prototype, "users", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => User_1.User),
    __param(0, (0, type_graphql_1.Arg)('options')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolve.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => LoginResponse),
    __param(0, (0, type_graphql_1.Arg)('options')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolve.prototype, "login", null);
UserResolve = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolve);
exports.UserResolve = UserResolve;
