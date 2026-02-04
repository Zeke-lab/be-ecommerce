import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { ValidationError } from '../../utils/errors';
import * as userService from '../../services/auth/user';
import logger from '../../logger';

const registerUserSchema = z.object({
  email: z.email(),
  name: z.string().min(2),
  password: z.string().min(6),
});

const loginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  rememberMe: z.boolean().optional().default(true),
});

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('Authenticating user:', req);
    const response = userService.auth(req.user);
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    logger.info('Received registration request with data:', req.body);

    const validatedData = registerUserSchema.parse(req.body);
    const { email, name, password } = validatedData;

    // pass the data into service layer
    const response = await userService.registerUser(email, name, password);

    return res.status(201).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ValidationError(error.issues));
    } else {
      return next(error);
    }
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, rememberMe } = loginUserSchema.parse(req.body);

    const { refreshToken, accessToken, userInfo } = await userService.login(
      email,
      password,
      rememberMe,
    );

    // use HTTP only Cookie because we don't want JS to access it
    if (refreshToken) {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
    }

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return res.status(200).json({ ...userInfo });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ValidationError(error.issues));
    } else {
      return next(error);
    }
  }
};

export { registerUser, loginUser, auth };
