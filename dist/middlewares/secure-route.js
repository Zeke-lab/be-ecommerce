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
const errors_1 = require("../utils/errors");
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const env_1 = require("../env");
const prisma_1 = require("../libs/prisma");
const logger_1 = __importDefault(require("../logger"));
const secureRoute = () => {
    return async (req, res, next) => {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;
        if (!accessToken) {
            return next(new errors_1.AuthenticationError('Access token missing!'));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(accessToken, env_1.ENV.ACCESS_TOKEN_SECRET);
            const result = await prisma_1.prisma.user.findUnique({
                where: { id: decoded.userId },
            });
            if (!result) {
                return next(new errors_1.AuthenticationError('Access denied!'));
            }
            req.user = result;
            return next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.TokenExpiredError && refreshToken) {
                try {
                    const decodedRefreshToken = jsonwebtoken_1.default.verify(refreshToken, env_1.ENV.REFRESH_TOKEN_SECRET);
                    const result = await prisma_1.prisma.user.findUnique({
                        where: { id: decodedRefreshToken.userId },
                    });
                    if (!result) {
                        return next(new errors_1.AuthenticationError('Access denied!'));
                    }
                    const newRefreshToken = jsonwebtoken_1.default.sign({ userId: result.id }, env_1.ENV.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
                    const newAccessToken = jsonwebtoken_1.default.sign({ userId: result.id }, env_1.ENV.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
                    res.cookie('accessToken', newAccessToken, {
                        httpOnly: true,
                        sameSite: 'none',
                        secure: true,
                    });
                    res.cookie('refreshToken', newRefreshToken, {
                        httpOnly: true,
                        sameSite: 'none',
                        secure: true,
                    });
                    req.user = result;
                    return next();
                }
                catch (refreshError) {
                    res.clearCookie('refreshToken');
                    logger_1.default.error('Error verifying refresh token:', refreshError);
                    return next(new errors_1.AuthenticationError('Invalid refresh token!'));
                }
            }
            else {
                res.clearCookie('accessToken');
                res.clearCookie('refreshToken');
                logger_1.default.error('Error authenticating user:', error);
                return next(new errors_1.AuthenticationError('Invalid access token!'));
            }
        }
    };
};
exports.default = secureRoute;
