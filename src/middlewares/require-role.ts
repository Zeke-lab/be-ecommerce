import { Role } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../utils/errors';

const requireRole = (requiredRole: Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return next(new UnauthorizedError('User role missing'));
    }

    if (req.user.role !== requiredRole) {
      return next(new UnauthorizedError('Insufficient permissions'));
    }

    return next();
  };
};

export default requireRole;
