import { Prisma } from '@prisma/client';
import { prisma } from '../../libs/prisma';
import logger from '../../logger';
import { NotFoundError } from '../../utils/errors';

interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId?: number;
}

const createProduct = async (data: CreateProductData) => {
  try {
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new NotFoundError('Category not found');
      }
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: new Prisma.Decimal(data.price),
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
      },
    });

    return product;
  } catch (error) {
    logger.error('Error creating product: ', error);
    throw error;
  }
};

const productService = {
  createProduct,
};

export type { CreateProductData };
export { createProduct };
export default productService;
