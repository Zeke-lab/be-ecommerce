import { NextFunction, Request, Response } from 'express';
import z from 'zod';
import { InternalServerError, ValidationError } from '../../utils/errors';
import * as exampleService from '../../services/example/example';
// define the schema for the query parmeters

const sumSchema = z.object({
  a: z.number(),
  b: z.number(),
});

const sum = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { a, b } = sumSchema.parse(req.body);
    const result = exampleService.sum(a, b);
    return res.status(200).json({ result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ValidationError(error.issues));
    } else {
      return next(new InternalServerError('Internal Server Error'));
    }
  }
};

const getRandomNumber = (_req: Request, res: Response) => {
  const randomNumber = exampleService.getRandomNumber();
  return res.status(200).json({ randomNumber });
};

export { sum, getRandomNumber };
