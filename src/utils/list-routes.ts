import { Express } from 'express';

interface Route {
  method: string;
  path: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function extractPath(layer: any): string {
  if (layer.path && typeof layer.path === 'string') {
    return layer.path;
  }
  if (layer.regexp) {
    const regexpStr = layer.regexp.toString();
    // Match patterns like /^\/auth\/?(?=\/|$)/i
    const match = regexpStr.match(/^\/\^((?:\\\/[^\\/?]+)+)/);
    if (match) {
      return match[1].replace(/\\\//g, '/');
    }
  }
  return '';
}

function getRoutesFromStack(stack: any[], basePath: string = ''): Route[] {
  const routes: Route[] = [];

  if (!stack) return routes;

  for (const layer of stack) {
    if (layer.route) {
      const routePath = basePath + layer.route.path;
      const methods = Object.keys(layer.route.methods).filter(
        (m) => layer.route.methods[m],
      );

      for (const method of methods) {
        routes.push({
          method: method.toUpperCase(),
          path: routePath || '/',
        });
      }
    } else if (layer.name === 'router' && layer.handle?.stack) {
      const layerPath = extractPath(layer);
      const nestedRoutes = getRoutesFromStack(
        layer.handle.stack,
        basePath + layerPath,
      );
      routes.push(...nestedRoutes);
    }
  }

  return routes;
}

export function listRoutes(app: Express): Route[] {
  const router = (app as any)._router || (app as any).router;
  if (!router) return [];
  return getRoutesFromStack(router.stack);
}
/* eslint-enable @typescript-eslint/no-explicit-any */
