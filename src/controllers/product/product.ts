import { NextFunction, Request, Response } from 'express';
import * as productService from '../../services/product/product';
import * as z from 'zod';
import { ValidationError } from '../../utils/errors';

const createProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  imageUrl: z.string().url().optional(),
  categoryId: z.number().int().optional(),
});

const updateProductSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  imageUrl: z.string().url().optional(),
  categoryId: z.number().int().optional(),
});

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getProducts();
    return res.status(200).json(products);
  } catch (error) {
    return next(error);
  }
};

const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(+id);
    return res.status(200).json(product);
  } catch (error) {
    return next(error);
  }
};

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, imageUrl, categoryId } =
      createProductSchema.parse(req.body);

    const product = await productService.createProduct(
      name,
      price,
      description,
      imageUrl,
      categoryId,
    );

    return res.status(201).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ValidationError(error.issues));
    }

    return next(error);
  }
};

const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl, categoryId } =
      updateProductSchema.parse(req.body);

    const product = await productService.updateProduct(
      +id,
      name,
      price,
      description,
      imageUrl,
      categoryId,
    );

    return res.status(200).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ValidationError(error.issues));
    }

    return next(error);
  }
};

const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await productService.deleteProduct(+id);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

