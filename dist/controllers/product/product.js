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
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const productService = __importStar(require("../../services/product/product"));
const z = __importStar(require("zod"));
const errors_1 = require("../../utils/errors");
const createProductSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    price: z.number(),
    imageUrl: z.string().url().optional(),
    categoryId: z.number().int().optional(),
});
const updateProductSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    imageUrl: z.string().url().optional(),
    categoryId: z.number().int().optional(),
});
const getProducts = async (req, res, next) => {
    try {
        const products = await productService.getProducts();
        return res.status(200).json(products);
    }
    catch (error) {
        return next(error);
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(+id);
        return res.status(200).json(product);
    }
    catch (error) {
        return next(error);
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, imageUrl, categoryId } = createProductSchema.parse(req.body);
        const product = await productService.createProduct(name, price, description, imageUrl, categoryId);
        return res.status(201).json(product);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return next(new errors_1.ValidationError(error.issues));
        }
        return next(error);
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, price, imageUrl, categoryId } = updateProductSchema.parse(req.body);
        const product = await productService.updateProduct(+id, name, price, description, imageUrl, categoryId);
        return res.status(200).json(product);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return next(new errors_1.ValidationError(error.issues));
        }
        return next(error);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        await productService.deleteProduct(+id);
        return res.status(204).send();
    }
    catch (error) {
        return next(error);
    }
};
exports.deleteProduct = deleteProduct;
