import { NextFunction, Request, Response } from 'express';
import * as z from 'zod';
import { OrderStatus } from '@prisma/client';
import orderService from '../../services/order/order';
import { ValidationError } from '../../utils/errors';

const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
});

const updateOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  items: z.array(orderItemSchema).min(1).optional(),
});

const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.getOrdersByUser(req.user!.id);
    return res.status(200).json(orders);
  } catch (error) {
    return next(error);
  }
};

const getMyOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderByIdForUser(+id, req.user!.id);
    return res.status(200).json(order);
  } catch (error) {
    return next(error);
  }
};

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items } = createOrderSchema.parse(req.body);
    const order = await orderService.createOrder(req.user!.id, items);
    return res.status(201).json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ValidationError(error.issues));
    }
    return next(error);
  }
};

const updateMyOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const data = updateOrderSchema.parse(req.body);
    const order = await orderService.updateOrderForUser(+id, req.user!.id, data);
    return res.status(200).json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ValidationError(error.issues));
    }
    return next(error);
  }
};

const deleteMyOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await orderService.deleteOrderForUser(+id, req.user!.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

const adminGetOrders = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orders = await orderService.getAllOrders();
    return res.status(200).json(orders);
  } catch (error) {
    return next(error);
  }
};

const adminGetOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(+id);
    return res.status(200).json(order);
  } catch (error) {
    return next(error);
  }
};

const adminUpdateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const data = updateOrderSchema.parse(req.body);
    const order = await orderService.updateOrderAsAdmin(+id, data);
    return res.status(200).json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ValidationError(error.issues));
    }
    return next(error);
  }
};

const adminDeleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await orderService.deleteOrderAsAdmin(+id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

export {
  getMyOrders,
  getMyOrderById,
  createOrder,
  updateMyOrder,
  deleteMyOrder,
  adminGetOrders,
  adminGetOrderById,
  adminUpdateOrder,
  adminDeleteOrder,
};
