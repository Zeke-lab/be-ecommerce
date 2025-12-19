import { prisma } from '../../libs/prisma';
import logger from '../../logger';
import { ConflictError } from '../../utils/errors';
import bcrypt from 'bcryptjs';

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

export { registerUser };
