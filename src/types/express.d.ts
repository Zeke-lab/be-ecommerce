/*
    The Request interface from Express is extended here to include a custom property.
    This allows us to attach additional information to the request object that can be
    accessed in our route handlers and middlewares.
*/

import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
