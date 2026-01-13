import { NextFunction, Request, Response } from 'express';
import * as categoryService from '../../services/category/category';
import * as z from 'zod';
import { ValidationError } from '../../utils/errors';

const createCategorySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

const updateCategorySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await categoryService.getCategories();
    return res.status(200).json(categories);
  } catch (error) {
    return next(error);
  }
};

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, description } = createCategorySchema.parse(req.body);
    const category = await categoryService.createCategory(name, description);

    return res.status(201).json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ValidationError(error.issues));
    } else {
      return next(error);
    }
  }
};

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { name, description } = updateCategorySchema.parse(req.body);

    const category = await categoryService.updateCategory(
      +id,
      name,
      description,
    );
    return res.status(200).json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ValidationError(error.issues));
    } else {
      return next(error);
    }
  }
};

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    await categoryService.deleteCategory(+id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

export { createCategory, getCategories, updateCategory, deleteCategory };
