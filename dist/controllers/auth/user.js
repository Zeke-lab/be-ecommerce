"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.loginUser = exports.registerUser = void 0;
const zod_1 = require("zod");
const errors_1 = require("../../utils/errors");
const userService = __importStar(require("../../services/auth/user"));
const logger_1 = __importDefault(require("../../logger"));
const registerUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(2),
    password: zod_1.z.string().min(6),
});
const loginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    rememberMe: zod_1.z.boolean().optional().default(true),
});
const auth = (req, res, next) => {
    try {
        logger_1.default.info('Authenticating user:', req);
        const response = userService.auth(req.user);
        return res.status(200).json(response);
    }
    catch (error) {
        return next(error);
    }
};
exports.auth = auth;
const registerUser = async (req, res, next) => {
    try {
        logger_1.default.info('Received registration request with data:', req.body);
        const validatedData = registerUserSchema.parse(req.body);
        const { email, name, password } = validatedData;
        const response = await userService.registerUser(email, name, password);
        return res.status(201).json(response);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return next(new errors_1.ValidationError(error.issues));
        }
        else {
            return next(error);
        }
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res, next) => {
    try {
        const { email, password, rememberMe } = loginUserSchema.parse(req.body);
        const { refreshToken, accessToken, userInfo } = await userService.login(email, password, rememberMe);
        if (refreshToken) {
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            });
        }
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });
        return res.status(200).json({ ...userInfo });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return next(new errors_1.ValidationError(error.issues));
        }
        else {
            return next(error);
        }
    }
};
exports.loginUser = loginUser;
