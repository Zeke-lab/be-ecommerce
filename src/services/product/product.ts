import { Prisma } from '@prisma/client';
import { prisma } from '../../libs/prisma';
import logger from '../../logger';
import { NotFoundError } from '../../utils/errors';

interface CreateProductData {
  code?: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  qty?: number;
  categoryId?: number;
}

const baseProductInclude = {
  category: {
    select: {
      id: true,
      name: true,
    },
  },
};

const getProducts = async () => {
  try {
    return await prisma.product.findMany({
      include: baseProductInclude,
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    logger.error('Error fetching products: ', error);
    throw error;
  }
};

const getProductById = async (id: number) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: baseProductInclude,
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return product;
  } catch (error) {
    logger.error('Error fetching product by id: ', error);
    throw error;
  }
};

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
        code: data.code,
        name: data.name,
        description: data.description,
        price: new Prisma.Decimal(data.price),
        imageUrl: data.imageUrl,
        qty: data.qty,
        categoryId: data.categoryId,
      },
      include: baseProductInclude,
    });

    return product;
  } catch (error) {
    logger.error('Error creating product: ', error);
    throw error;
  }
};

const updateProduct = async (id: number, data: Partial<CreateProductData>) => {
  try {
    const existingProduct = await prisma.product.findUnique({ where: { id } });

    if (!existingProduct) {
      throw new NotFoundError('Product not found');
    }

    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new NotFoundError('Category not found');
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
        price:
          typeof data.price === 'number'
            ? new Prisma.Decimal(data.price)
            : undefined,
      },
      include: baseProductInclude,
    });

    return updatedProduct;
  } catch (error) {
    logger.error('Error updating product: ', error);
    throw error;
  }
};

const deleteProduct = async (id: number) => {
  try {
    const existingProduct = await prisma.product.findUnique({ where: { id } });

    if (!existingProduct) {
      throw new NotFoundError('Product not found');
    }

    await prisma.product.delete({ where: { id } });
  } catch (error) {
    logger.error('Error deleting product: ', error);
    throw error;
  }
};

const productService = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

export type { CreateProductData };
export { createProduct, getProducts, getProductById, updateProduct, deleteProduct };
export default productService;
