"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomNumber = exports.sum = void 0;
const sum = (a, b) => {
    return a + b;
};
exports.sum = sum;
const getRandomNumber = () => {
    return Math.floor(Math.random() * 100);
};
exports.getRandomNumber = getRandomNumber;
