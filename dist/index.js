"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./logger"));
const env_1 = require("./env");
const error_handler_1 = __importDefault(require("./middlewares/error-handler"));
const gateway_1 = __importDefault(require("./routes/gateway"));
const list_routes_1 = require("./utils/list-routes");
const errors_1 = require("./utils/errors");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
logger_1.default.info('Application is starting...');
const app = (0, express_1.default)();
logger_1.default.info('Setting up middlewares...');
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    credentials: true,
    origin: 'http://localhost:5173',
}));
app.use(gateway_1.default);
app.use((_req, _res, next) => {
    return next(new errors_1.NotFoundError('Route not found'));
});
app.use(error_handler_1.default);
app.listen(env_1.ENV.PORT, () => {
    logger_1.default.verbose(`ENV is pointing to ${env_1.ENV.NODE_ENV !== 'production'
        ? JSON.stringify(env_1.ENV, undefined, 2)
        : env_1.ENV.NODE_ENV}`);
    (0, list_routes_1.listRoutes)(app).forEach((route) => {
        logger_1.default.verbose(`${route.method} ${route.path}`);
    });
    logger_1.default.info(`Server is running on http://localhost:${env_1.ENV.PORT}`);
});
