import { ENV } from '../../env';
import { prisma } from '../../libs/prisma';
import logger from '../../logger';
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from '../../utils/errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface UserInfo {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
}

const registerUser = async (email: string, name: string, password: string) => {
  try {
    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // 2. Hash Pasword
    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashedPassword,
      },
    });

    return {
      email: result.email,
      name: result.name,
    };
  } catch (error) {
    logger.error('Error in registerUser service:', error);
    throw error;
  }
};

// rememberMe => refreshToken logic
const login = async (email: string, password: string, rememberMe: boolean) => {
  try {
    // 1. check if user exists
    const result = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!result) {
      throw new NotFoundError('User not found');
    }

    // 2. check if password is correct
    const isPasswordMatch = bcrypt.compare(password, result.password);
    if (!isPasswordMatch) {
      throw new AuthenticationError('Invalid credentials');
    }

    // 3. check rememberMe for refreshToken logic
    const refreshToken = rememberMe
      ? jwt.sign({ userId: result.id }, ENV.REFRESH_TOKEN_SECRET, {
          expiresIn: '30d',
        })
      : undefined;

    // 4. generate accessToken
    const accessToken = jwt.sign(
      { userId: result.id },
      ENV.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' },
    );

    const userInfo: UserInfo = {
      id: result.id,
      email: result.email,
      name: result.name,
      createdAt: result.createdAt,
    };

    return {
      refreshToken,
      accessToken,
      userInfo,
    };
  } catch (error) {
    logger.error('Error in login service:', error);
    throw error;
  }
};

export { registerUser, login };
