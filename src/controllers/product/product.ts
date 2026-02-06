import { NextFunction, Request, Response } from 'express';
import * as z from 'zod';
import { ValidationError } from '../../utils/errors';
import productService from '../../services/product/product';

const createProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number().positive(),
  imageUrl: z.string().optional(),
  categoryId: z.number().int().positive().optional(),
});

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = createProductSchema.parse(req.body);
    const product = await productService.createProduct(data);

    return res.status(201).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ValidationError(error.issues));
    }

    return next(error);
  }
};

export { createProduct };
