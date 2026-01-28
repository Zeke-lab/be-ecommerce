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
exports.getRandomNumber = exports.sum = void 0;
const zod_1 = __importDefault(require("zod"));
const errors_1 = require("../../utils/errors");
const exampleService = __importStar(require("../../services/example/example"));
const sumSchema = zod_1.default.object({
    a: zod_1.default.number(),
    b: zod_1.default.number(),
});
const sum = (req, res, next) => {
    try {
        const { a, b } = sumSchema.parse(req.body);
        const result = exampleService.sum(a, b);
        return res.status(200).json({ result });
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            return next(new errors_1.ValidationError(error.issues));
        }
        else {
            return next(new errors_1.InternalServerError('Internal Server Error'));
        }
    }
};
exports.sum = sum;
const getRandomNumber = (_req, res) => {
    const randomNumber = exampleService.getRandomNumber();
    return res.status(200).json({ randomNumber });
};
exports.getRandomNumber = getRandomNumber;
