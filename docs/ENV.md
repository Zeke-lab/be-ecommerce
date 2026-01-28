# Environment setup

This backend requires a PostgreSQL connection string for Prisma.

## Required variables

Create a `.env` file in `be-ecommerce/` (project root) and set:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?schema=public"
```

## Example (local postgres)

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/be_ecommerce?schema=public"
```

Then run:

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

