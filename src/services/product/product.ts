import { prisma } from '../../libs/prisma';
import logger from '../../logger';
import { NotFoundError } from '../../utils/errors';

const createProduct = async (
  name: string,
  price: number,
  description?: string,
  imageUrl?: string,
  categoryId?: number,
) => {
  try {
    const product = await prisma.product.create({
      data: {
        name,
        price,
        description,
        imageUrl,
        categoryId,
      },
    });

    return product;
  } catch (error) {
    logger.error('Error creating product: ', error);
    throw error;
  }
};

const getProducts = async () => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });

    return products;
  } catch (error) {
    logger.error('Error fetching products: ', error);
    throw error;
  }
};

const getProductById = async (id: number) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
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

const updateProduct = async (
  id: number,
  name?: string,
  price?: number,
  description?: string,
  imageUrl?: string,
  categoryId?: number,
) => {
  try {
    const productDb = await prisma.product.findUnique({
      where: { id },
    });

    if (!productDb) {
      throw new NotFoundError("Product doesn't exist");
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        description,
        imageUrl,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return updatedProduct;
  } catch (error) {
    logger.error('Error updating product: ', error);
    throw error;
  }
};

const deleteProduct = async (id: number) => {
  try {
    const productDb = await prisma.product.findUnique({
      where: { id },
    });

    if (!productDb) {
      throw new NotFoundError("Product doesn't exist");
    }

    await prisma.product.delete({
      where: { id },
    });
  } catch (error) {
    logger.error('Error deleting product: ', error);
    throw error;
  }
};

export { createProduct, getProducts, getProductById, updateProduct, deleteProduct };

