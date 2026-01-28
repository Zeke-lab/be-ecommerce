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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryById = exports.deleteCategory = exports.updateCategory = exports.getCategories = exports.createCategory = void 0;
const categoryService = __importStar(require("../../services/category/category"));
const z = __importStar(require("zod"));
const errors_1 = require("../../utils/errors");
const createCategorySchema = z.object({
    name: z.string(),
    description: z.string().optional(),
});
const updateCategorySchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
});
const getCategories = async (req, res, next) => {
    try {
        const categories = await categoryService.getCategories();
        return res.status(200).json(categories);
    }
    catch (error) {
        return next(error);
    }
};
exports.getCategories = getCategories;
const createCategory = async (req, res, next) => {
    try {
        const { name, description } = createCategorySchema.parse(req.body);
        const category = await categoryService.createCategory(name, description);
        return res.status(201).json(category);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return next(new errors_1.ValidationError(error.issues));
        }
        else {
            return next(error);
        }
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description } = updateCategorySchema.parse(req.body);
        const category = await categoryService.updateCategory(+id, name, description);
        return res.status(200).json(category);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return next(new errors_1.ValidationError(error.issues));
        }
        else {
            return next(error);
        }
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        await categoryService.deleteCategory(+id);
        return res.status(204).send();
    }
    catch (error) {
        return next(error);
    }
};
exports.deleteCategory = deleteCategory;
const getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await categoryService.getCategoryById(+id);
        return res.status(200).json(category);
    }
    catch (error) {
        return next(error);
    }
};
exports.getCategoryById = getCategoryById;
