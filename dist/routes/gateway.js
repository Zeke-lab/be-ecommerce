"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth/auth"));
const example_1 = __importDefault(require("./example/example"));
const category_1 = __importDefault(require("./category/category"));
const product_1 = __importDefault(require("./product/product"));
const gateway = (0, express_1.Router)();
gateway.use('/auth', auth_1.default);
gateway.use('/example', example_1.default);
gateway.use('/categories', category_1.default);
gateway.use('/products', product_1.default);
exports.default = gateway;
