import { prisma } from '../../libs/prisma';
import logger from '../../logger';
import { NotFoundError } from '../../utils/errors';

const createCategory = async (name: string, description?: string) => {
  try {
    const category = await prisma.category.create({
      data: {
        name: name,
        description: description,
      },
    });

    return category;
  } catch (error) {
    logger.error('Error creating category: ', error);
    throw error;
  }
};

const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany();
    return categories;
  } catch (error) {
    logger.error('Error fetching categories: ', error);
    throw error;
  }
};

const updateCategory = async (
  id: number,
  name?: string,
  description?: string,
) => {
  try {
    // check if category exists
    const categoryDB = await prisma.category.findUnique({
      where: { id: id },
    });

    if (!categoryDB) {
      throw new NotFoundError("Category doesn't exist");
    }

    const updatedCategory = await prisma.category.update({
      data: {
        name: name,
        description: description,
      },
      where: { id: id },
    });

    return updatedCategory;
  } catch (error) {
    logger.error('Error updating category: ', error);
    throw error;
  }
};

const deleteCategory = async (id: number) => {
  try {
    // check if category exists
    const categoryDB = await prisma.category.findUnique({
      where: { id: id },
    });

    if (!categoryDB) {
      throw new NotFoundError("Category doesn't exist");
    }

    await prisma.category.delete({
      where: { id: id },
    });
  } catch (error) {
    logger.error('Error deleting category: ', error);
    throw error;
  }
};

const getCategoryById = async (id: number) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: id }
    })

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return category;

  } catch (error) {
    logger.error('Error fetching category by id: ', error);
    throw error;
  }
}

export { createCategory, getCategories, updateCategory, deleteCategory, getCategoryById };
