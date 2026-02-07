import { NextFunction, Request, Response } from 'express';
import * as z from 'zod';
import { ValidationError } from '../../utils/errors';
import productService from '../../services/product/product';

const createProductSchema = z.object({
  code: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number().positive(),
  imageUrl: z.string().optional(),
  qty: z.number().int().nonnegative().optional(),
  categoryId: z.number().int().positive().optional(),
});

const updateProductSchema = createProductSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: 'At least one field must be provided to update the product',
  },
);

const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getProducts();
    return res.status(200).json(products);
  } catch (error) {
    return next(error);
  }
};

const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(+id);
    return res.status(200).json(product);
  } catch (error) {
    return next(error);
  }
};

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

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const data = updateProductSchema.parse(req.body);
    const product = await productService.updateProduct(+id, data);

    return res.status(200).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ValidationError(error.issues));
    }

    return next(error);
  }
};

const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(+id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
