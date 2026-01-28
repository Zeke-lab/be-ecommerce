"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryById = exports.deleteCategory = exports.updateCategory = exports.getCategories = exports.createCategory = void 0;
const prisma_1 = require("../../libs/prisma");
const logger_1 = __importDefault(require("../../logger"));
const errors_1 = require("../../utils/errors");
const createCategory = async (name, description) => {
    try {
        const category = await prisma_1.prisma.category.create({
            data: {
                name: name,
                description: description,
            },
        });
        return category;
    }
    catch (error) {
        logger_1.default.error('Error creating category: ', error);
        throw error;
    }
};
exports.createCategory = createCategory;
const getCategories = async () => {
    try {
        const categories = await prisma_1.prisma.category.findMany();
        return categories;
    }
    catch (error) {
        logger_1.default.error('Error fetching categories: ', error);
        throw error;
    }
};
exports.getCategories = getCategories;
const updateCategory = async (id, name, description) => {
    try {
        const categoryDB = await prisma_1.prisma.category.findUnique({
            where: { id: id },
        });
        if (!categoryDB) {
            throw new errors_1.NotFoundError("Category doesn't exist");
        }
        const updatedCategory = await prisma_1.prisma.category.update({
            data: {
                name: name,
                description: description,
            },
            where: { id: id },
        });
        return updatedCategory;
    }
    catch (error) {
        logger_1.default.error('Error updating category: ', error);
        throw error;
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (id) => {
    try {
        const categoryDB = await prisma_1.prisma.category.findUnique({
            where: { id: id },
        });
        if (!categoryDB) {
            throw new errors_1.NotFoundError("Category doesn't exist");
        }
        await prisma_1.prisma.category.delete({
            where: { id: id },
        });
    }
    catch (error) {
        logger_1.default.error('Error deleting category: ', error);
        throw error;
    }
};
exports.deleteCategory = deleteCategory;
const getCategoryById = async (id) => {
    try {
        const category = await prisma_1.prisma.category.findUnique({
            where: { id: id }
        });
        if (!category) {
            throw new errors_1.NotFoundError('Category not found');
        }
        return category;
    }
    catch (error) {
        logger_1.default.error('Error fetching category by id: ', error);
        throw error;
    }
};
exports.getCategoryById = getCategoryById;
