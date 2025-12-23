import { NextFunction, Request, Response } from 'express';
import { AuthenticationError } from '../utils/errors';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { ENV } from '../env';
import { prisma } from '../libs/prisma';
import logger from '../logger';

interface JWTPayload {
  userId: number;
}

const secureRoute = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken) {
      return next(new AuthenticationError('Access token missing!'));
    }

    try {
      const decoded = jwt.verify(
        accessToken,
        ENV.ACCESS_TOKEN_SECRET,
      ) as JWTPayload;
      const result = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
      if (!result) {
        return next(new AuthenticationError('Access denied!'));
      }

      req.user = result;
      return next();
    } catch (error) {
      if (error instanceof TokenExpiredError && refreshToken) {
        // if token is expired, verify refresh token, and issue new access token
        try {
          const decodedRefreshToken = jwt.verify(
            refreshToken,
            ENV.REFRESH_TOKEN_SECRET,
          ) as JWTPayload;
          const result = await prisma.user.findUnique({
            where: { id: decodedRefreshToken.userId },
          });
          if (!result) {
            return next(new AuthenticationError('Access denied!'));
          }
          const newRefreshToken = jwt.sign(
            { userId: result.id },
            ENV.REFRESH_TOKEN_SECRET,
            { expiresIn: '30d' },
          );
          const newAccessToken = jwt.sign(
            { userId: result.id },
            ENV.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' },
          );
          res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
          });
          res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
          });
          req.user = result;
          return next();
        } catch (refreshError) {
          res.clearCookie('refreshToken');
          logger.error('Error verifying refresh token:', refreshError);
          return next(new AuthenticationError('Invalid refresh token!'));
        }
      } else {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        logger.error('Error authenticating user:', error);
        return next(new AuthenticationError('Invalid access token!'));
      }
    }
  };
};

export default secureRoute;
