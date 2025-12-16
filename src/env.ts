export const ENV = {
  APP: process.env.APP || 'be-ecommerce',
  NODE_ENV: (process.env.NODE_ENV || 'dev') as 'local' | 'dev' | 'production',
  PORT: process.env.PORT || 3000,
};
