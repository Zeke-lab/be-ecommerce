# Simple E-Commerce

# **Core Features**:

1. **Authentication**
   - Register / Login with JWT
   - Roles: USER (customer) and ADMIN
2. **User (Customer) Features**
   - Browse products (with categories)
   - View product details
   - Add/remove items to cart
   - Checkout → create an order (no real payment, just simulate)
   - View own order history with status (Pending → Processing → Delivered → Cancelled)
3. **Admin Features**
   - CRUD Categories
   - CRUD Products (each product belongs to one category)
   - View all orders from all users
   - Update order status

# **Out of Scope for Now**:

- Real payment (Stripe later)
- Inventory/stock deduction
- Reviews, wishlist, search, etc.
- Image upload w/ supabase

# Tech Stack

- **Backend**: Node.js + Express
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT (stored in httpOnly cookie or localStorage)
- **Frontend**: React (with React Router + Context or Zustand for cart/auth)

# Key Design Notes

- **User → Order**: One user has many orders.
- **Order → OrderItem**: One order has many items (like cart lines).
- **Product → Category**: Many products belong to one category.
- **OrderStatus enum**: Easy to manage and extend.
- **totalAmount** stored on Order for quick access (calculated from items during checkout).
- **unitPrice** saved on OrderItem to preserve historical pricing.

```js
// Public
GET    /api/products              → list all products
GET    /api/products/:id          → product detail
GET    /api/categories            → list categories

// Auth required
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me               → get current user

// User routes (role: USER)
POST   /api/orders                → create order (checkout)
GET    /api/orders                → get my orders
GET    /api/orders/:id            → get my order detail

// Admin routes (role: ADMIN)
GET    /api/admin/orders          → get ALL orders (with user info)
PATCH  /api/admin/orders/:id      → update status

POST   /api/admin/categories
GET    /api/admin/categories
PUT    /api/admin/categories/:id
DELETE /api/admin/categories/:id

POST   /api/admin/products
GET    /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
```
