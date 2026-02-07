import { OrderStatus, Prisma } from '@prisma/client';
import { prisma } from '../../libs/prisma';
import logger from '../../logger';
import { BadRequestError, NotFoundError } from '../../utils/errors';

export interface OrderItemInput {
  productId: number;
  quantity: number;
}

export interface UpdateOrderPayload {
  status?: OrderStatus;
  items?: OrderItemInput[];
}

const orderInclude = {
  items: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
    },
  },
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
};

const validateItemsInput = (items?: OrderItemInput[]) => {
  if (!items || items.length === 0) {
    throw new BadRequestError('Order must contain at least one item.');
  }
};

const buildOrderItemsPayload = async (items: OrderItemInput[]) => {
  validateItemsInput(items);

  const productIds = [...new Set(items.map((item) => item.productId))];
  
  logger.info(`Looking for products with IDs: ${JSON.stringify(productIds)}`);
  
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });
  
  logger.info(`Found ${products.length} products: ${JSON.stringify(products.map(p => ({ id: p.id, name: p.name })))}`);

  if (products.length !== productIds.length) {
    logger.error(`Product count mismatch! Expected ${productIds.length}, found ${products.length}`);
    throw new NotFoundError('One or more products were not found.');
  }

  const productMap = new Map(products.map((product) => [product.id, product]));
  let totalAmount = new Prisma.Decimal(0);

  const orderItemsData = items.map((item) => {
    const product = productMap.get(item.productId);

    if (!product) {
      throw new NotFoundError(`Product with ID ${item.productId} not found.`);
    }

    const unitPrice = product.price as Prisma.Decimal;
    const subtotal = unitPrice.mul(item.quantity);
    totalAmount = totalAmount.add(subtotal);

    return {
      productId: item.productId,
      quantity: item.quantity,
      unitPrice,
      subtotal,
    };
  });

  return { orderItemsData, totalAmount };
};

const createOrder = async (userId: number, items: OrderItemInput[]) => {
  try {
    const { orderItemsData, totalAmount } = await buildOrderItemsPayload(items);

    return await prisma.order.create({
      data: {
        userId,
        totalAmount,
        items: { create: orderItemsData },
      },
      include: orderInclude,
    });
  } catch (error) {
    logger.error('Error creating order: ', error);
    throw error;
  }
};

const getOrdersByUser = async (userId: number) => {
  try {
    return await prisma.order.findMany({
      where: { userId },
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    logger.error('Error fetching user orders: ', error);
    throw error;
  }
};

const getOrderByIdForUser = async (orderId: number, userId: number) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: orderInclude,
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    return order;
  } catch (error) {
    logger.error('Error fetching order for user: ', error);
    throw error;
  }
};

const updateOrderForUser = async (
  orderId: number,
  userId: number,
  payload: UpdateOrderPayload,
) => {
  try {
    const existingOrder = await prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!existingOrder) {
      throw new NotFoundError('Order not found');
    }

    if (!payload.status && (!payload.items || payload.items.length === 0)) {
      throw new BadRequestError('No updates provided for the order.');
    }

    let totalAmountUpdate: Prisma.Decimal | undefined;
    let orderItemsMutation;

    if (payload.items && payload.items.length > 0) {
      const { orderItemsData, totalAmount } = await buildOrderItemsPayload(
        payload.items,
      );
      totalAmountUpdate = totalAmount;
      orderItemsMutation = {
        deleteMany: {},
        create: orderItemsData,
      };
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: payload.status,
        totalAmount: totalAmountUpdate,
        items: orderItemsMutation,
      },
      include: orderInclude,
    });

    return updatedOrder;
  } catch (error) {
    logger.error('Error updating order for user: ', error);
    throw error;
  }
};

const deleteOrderForUser = async (orderId: number, userId: number) => {
  try {
    const existingOrder = await prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!existingOrder) {
      throw new NotFoundError('Order not found');
    }

    await prisma.order.delete({ where: { id: orderId } });
  } catch (error) {
    logger.error('Error deleting order for user: ', error);
    throw error;
  }
};

const getAllOrders = async () => {
  try {
    return await prisma.order.findMany({
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    logger.error('Error fetching all orders: ', error);
    throw error;
  }
};

const getOrderById = async (orderId: number) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: orderInclude,
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    return order;
  } catch (error) {
    logger.error('Error fetching order by id: ', error);
    throw error;
  }
};

const updateOrderAsAdmin = async (
  orderId: number,
  payload: UpdateOrderPayload,
) => {
  try {
    const existingOrder = await prisma.order.findUnique({ where: { id: orderId } });

    if (!existingOrder) {
      throw new NotFoundError('Order not found');
    }

    if (!payload.status && (!payload.items || payload.items.length === 0)) {
      throw new BadRequestError('No updates provided for the order.');
    }

    let totalAmountUpdate: Prisma.Decimal | undefined;
    let orderItemsMutation;

    if (payload.items && payload.items.length > 0) {
      const { orderItemsData, totalAmount } = await buildOrderItemsPayload(
        payload.items,
      );
      totalAmountUpdate = totalAmount;
      orderItemsMutation = {
        deleteMany: {},
        create: orderItemsData,
      };
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: payload.status,
        totalAmount: totalAmountUpdate,
        items: orderItemsMutation,
      },
      include: orderInclude,
    });

    return updatedOrder;
  } catch (error) {
    logger.error('Error updating order as admin: ', error);
    throw error;
  }
};

const deleteOrderAsAdmin = async (orderId: number) => {
  try {
    const existingOrder = await prisma.order.findUnique({ where: { id: orderId } });

    if (!existingOrder) {
      throw new NotFoundError('Order not found');
    }

    await prisma.order.delete({ where: { id: orderId } });
  } catch (error) {
    logger.error('Error deleting order as admin: ', error);
    throw error;
  }
};

export const orderService = {
  createOrder,
  getOrdersByUser,
  getOrderByIdForUser,
  updateOrderForUser,
  deleteOrderForUser,
  getAllOrders,
  getOrderById,
  updateOrderAsAdmin,
  deleteOrderAsAdmin,
};

export default orderService;
