export const ENV = {
  APP: process.env.APP || 'be-ecommerce',
  NODE_ENV: (process.env.NODE_ENV || 'dev') as 'local' | 'dev' | 'production',
  PORT: process.env.PORT || 3000,
  // REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret',
  // ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'access-token-secret',
  REFRESH_TOKEN_SECRET:
    'Fzf3kEb6l9aAX8md4/2qnxV/R+lPnM2l5hOX527BsQQ8XFhTS785bUejQL7BrEcD00CZoUPt7viIVgqx%',
  ACCESS_TOKEN_SECRET:
    'pyQmxfCTIPhovLCjZ9bbD8jBDtuw/FJ3sVueCIZ8WF/7cIRv/vM7uMvsx/u7n6e3PjMm7uL2xQalg80w%',
};
