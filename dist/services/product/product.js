"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const prisma_1 = require("../../libs/prisma");
const logger_1 = __importDefault(require("../../logger"));
const errors_1 = require("../../utils/errors");
const createProduct = async (name, price, description, imageUrl, categoryId) => {
    try {
        const product = await prisma_1.prisma.product.create({
            data: {
                name,
                price,
                description,
                imageUrl,
                categoryId,
            },
        });
        return product;
    }
    catch (error) {
        logger_1.default.error('Error creating product: ', error);
        throw error;
    }
};
exports.createProduct = createProduct;
const getProducts = async () => {
    try {
        const products = await prisma_1.prisma.product.findMany({
            include: {
                category: true,
            },
        });
        return products;
    }
    catch (error) {
        logger_1.default.error('Error fetching products: ', error);
        throw error;
    }
};
exports.getProducts = getProducts;
const getProductById = async (id) => {
    try {
        const product = await prisma_1.prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });
        if (!product) {
            throw new errors_1.NotFoundError('Product not found');
        }
        return product;
    }
    catch (error) {
        logger_1.default.error('Error fetching product by id: ', error);
        throw error;
    }
};
exports.getProductById = getProductById;
const updateProduct = async (id, name, price, description, imageUrl, categoryId) => {
    try {
        const productDb = await prisma_1.prisma.product.findUnique({
            where: { id },
        });
        if (!productDb) {
            throw new errors_1.NotFoundError("Product doesn't exist");
        }
        const updatedProduct = await prisma_1.prisma.product.update({
            where: { id },
            data: {
                name,
                price,
                description,
                imageUrl,
                categoryId,
            },
            include: {
                category: true,
            },
        });
        return updatedProduct;
    }
    catch (error) {
        logger_1.default.error('Error updating product: ', error);
        throw error;
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (id) => {
    try {
        const productDb = await prisma_1.prisma.product.findUnique({
            where: { id },
        });
        if (!productDb) {
            throw new errors_1.NotFoundError("Product doesn't exist");
        }
        await prisma_1.prisma.product.delete({
            where: { id },
        });
    }
    catch (error) {
        logger_1.default.error('Error deleting product: ', error);
        throw error;
    }
};
exports.deleteProduct = deleteProduct;
