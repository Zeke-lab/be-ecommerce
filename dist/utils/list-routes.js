"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRoutes = listRoutes;
function extractPath(layer) {
    if (layer.path && typeof layer.path === 'string') {
        return layer.path;
    }
    if (layer.regexp) {
        const regexpStr = layer.regexp.toString();
        const match = regexpStr.match(/^\/\^((?:\\\/[^\\/?]+)+)/);
        if (match) {
            return match[1].replace(/\\\//g, '/');
        }
    }
    return '';
}
function getRoutesFromStack(stack, basePath = '') {
    const routes = [];
    if (!stack)
        return routes;
    for (const layer of stack) {
        if (layer.route) {
            const routePath = basePath + layer.route.path;
            const methods = Object.keys(layer.route.methods).filter((m) => layer.route.methods[m]);
            for (const method of methods) {
                routes.push({
                    method: method.toUpperCase(),
                    path: routePath || '/',
                });
            }
        }
        else if (layer.name === 'router' && layer.handle?.stack) {
            const layerPath = extractPath(layer);
            const nestedRoutes = getRoutesFromStack(layer.handle.stack, basePath + layerPath);
            routes.push(...nestedRoutes);
        }
    }
    return routes;
}
function listRoutes(app) {
    const router = app._router || app.router;
    if (!router)
        return [];
    return getRoutesFromStack(router.stack);
}
