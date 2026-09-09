# DailyfixCare - Healthcare E-commerce Platform

A full-stack healthcare e-commerce platform built with React, Node.js, Express, and MySQL.

## Features

### Customer Features
- Browse products by category
- Search products
- Product details with images and reviews
- Add to cart
- Guest checkout (no login required)
- Order tracking
- Coupon codes
- Multiple payment options (COD, Razorpay ready)

### Admin Features
- Dashboard with analytics (orders, revenue, products, customers)
- Product management
- Category management
- Order management
- Coupon management
- Sales reports and charts

## Tech Stack

### Frontend
- React 18
- React Router
- Tailwind CSS
- Framer Motion
- Lucide Icons
- Axios
- React Hot Toast
- Recharts

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication
- Multer (file upload)
- Bcrypt (password hashing)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL
- npm or yarn

### Installation

1. Clone or download the project

2. Set up the database:
   - Create a MySQL database named `dailyfixcare`
   - Import the schema from `server/config/schema.sql`

3. Configure backend:
   ```bash
   cd server
   npm install
   ```
   - Create a `.env` file in the server directory:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=dailyfixcare
   JWT_SECRET=your_jwt_secret_key_here
   ADMIN_EMAIL=avidevelop60@gmail.com
   ADMIN_PASSWORD=admin123
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

5. Set up frontend:
   ```bash
   cd ../client
   npm install
   ```

6. Start the frontend:
   ```bash
   npm run dev
   ```

7. Open your browser and go to `http://localhost:5173`

## Default Admin Credentials
- Email: avidevelop60@gmail.com
- Password: admin123

## Project Structure
```
daily/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── layouts/       # Layout components
│   │   ├── context/       # React context
│   │   └── services/      # API services
│   └── package.json
└── server/                # Node.js backend
    ├── config/           # Database config and schema
    ├── controllers/      # Route controllers
    ├── routes/           # API routes
    ├── middleware/       # Custom middleware
    ├── uploads/          # Uploaded files
    └── server.js         # Entry point
```

## API Endpoints

### Admin
- POST /api/admin/login - Admin login
- POST /api/admin/logout - Admin logout
- GET /api/admin/dashboard - Get dashboard stats

### Products
- GET /api/products - Get all products
- GET /api/products/featured - Get featured products
- GET /api/products/best-sellers - Get best sellers
- GET /api/products/new-arrivals - Get new arrivals
- GET /api/products/:id - Get product by ID
- POST /api/products - Create product (admin)
- PUT /api/products/:id - Update product (admin)
- DELETE /api/products/:id - Delete product (admin)

### Categories
- GET /api/categories - Get all categories
- GET /api/categories/:id - Get category by ID
- POST /api/categories - Create category (admin)

### Orders
- POST /api/orders - Create new order
- GET /api/orders/:id - Get order by ID
- GET /api/orders - Get all orders (admin)
- PUT /api/orders/:id/status - Update order status (admin)

### Coupons
- POST /api/coupons/validate - Validate coupon
- GET /api/coupons - Get all coupons (admin)
- POST /api/coupons - Create coupon (admin)

### Banners
- GET /api/banners - Get active banners
- GET /api/banners/admin - Get all banners (admin)
- POST /api/banners - Create banner (admin)
