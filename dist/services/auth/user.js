"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.login = exports.registerUser = void 0;
const env_1 = require("../../env");
const prisma_1 = require("../../libs/prisma");
const logger_1 = __importDefault(require("../../logger"));
const errors_1 = require("../../utils/errors");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (user) => {
    if (!user) {
        throw new errors_1.AuthenticationError('User not authenticated');
    }
    const userInfo = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
    };
    return userInfo;
};
exports.auth = auth;
const registerUser = async (email, name, password) => {
    try {
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email: email },
        });
        if (existingUser) {
            throw new errors_1.ConflictError('User with this email already exists');
        }
        const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
        const result = await prisma_1.prisma.user.create({
            data: {
                email: email,
                name: name,
                password: hashedPassword,
            },
        });
        return {
            email: result.email,
            name: result.name,
        };
    }
    catch (error) {
        logger_1.default.error('Error in registerUser service:', error);
        throw error;
    }
};
exports.registerUser = registerUser;
const login = async (email, password, rememberMe) => {
    try {
        const result = await prisma_1.prisma.user.findUnique({
            where: { email: email },
        });
        if (!result) {
            throw new errors_1.NotFoundError('User not found');
        }
        const isPasswordMatch = bcryptjs_1.default.compare(password, result.password);
        if (!isPasswordMatch) {
            throw new errors_1.AuthenticationError('Invalid credentials');
        }
        const refreshToken = rememberMe
            ? jsonwebtoken_1.default.sign({ userId: result.id }, env_1.ENV.REFRESH_TOKEN_SECRET, {
                expiresIn: '30d',
            })
            : undefined;
        const accessToken = jsonwebtoken_1.default.sign({ userId: result.id }, env_1.ENV.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
        const userInfo = {
            id: result.id,
            email: result.email,
            name: result.name,
            role: result.role,
            createdAt: result.createdAt,
        };
        return {
            refreshToken,
            accessToken,
            userInfo,
        };
    }
    catch (error) {
        logger_1.default.error('Error in login service:', error);
        throw error;
    }
};
exports.login = login;
