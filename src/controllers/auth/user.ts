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

export { registerUser };
