# E-commerce Product Catalog API (Node.js + Express + MongoDB)

## 1) Objective
To create a simple REST API for an E-commerce Product Catalog where users can register, login, and manage products (add, view, update, delete) using Node.js, Express, and MongoDB.

---

## 2) Tools & Technologies Used
- Node.js (JavaScript runtime)
- Express.js (web framework)
- MongoDB (database)
- Mongoose (MongoDB library for Node.js)
- Postman (API testing tool)
- JWT (JSON Web Token) for login token
- bcrypt / bcryptjs (password hashing)
- dotenv (for environment variables)

---

## 3) System Architecture (Simple Flow)
1. Client (Postman / Browser) sends a request to the API.
2. Server (Node.js + Express) receives the request and checks the route.
3. If route is protected, server verifies JWT token.
4. Server reads/writes data in MongoDB using Mongoose.
5. Server sends JSON response back to the client.

**Flow:** Client → Express Server → MongoDB Database → Response

---

## 4) Project Folder Structure (MVC)
```
E-commerceProductCatalog/
│
├── server.js
├── package.json
├── .env
├── postman_collection.json
│
├── config/
│   └── db.js
│
├── models/
│   ├── User.js
│   └── Product.js
│
├── controllers/
│   ├── authController.js
│   └── productController.js
│
├── routes/
│   ├── authRoutes.js
│   └── productRoutes.js
│
└── middleware/
    ├── auth.js
    ├── logger.js
    └── errorHandler.js
```

---

## 5) Database Schema (Main Collections)

### A) User Schema (users)
Main fields:
- `name` (String, required)
- `email` (String, required, unique, valid email format)
- `password` (String, required, minimum 6 characters, stored in hashed form)
- `createdAt` (Date, auto)

Basic validations:
- Email must be in correct format
- Password length must be at least 6

### B) Product Schema (products)
Main fields:
- `name` (String, required, minimum 3 characters)
- `price` (Number, required, minimum 0)
- `description` (String, optional)
- `category` (String, optional)
- `stock` (Number, default 0, minimum 0)
- `createdBy` (ObjectId, required, reference to User)
- `createdAt` (Date, auto)
- `updatedAt` (Date, auto)

Basic validations:
- Product name is required
- Price cannot be negative
- Stock cannot be negative

---

## 6) API Endpoints (Only List)

### Base URL
- `http://localhost:5000`

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`

### Products
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (Protected)
- `PUT /api/products/:id` (Protected)
- `DELETE /api/products/:id` (Protected)

### Health Check
- `GET /api/health`

---

## 7) Sample Request & Response (Simple Examples)

### A) POST Product (Create Product)
**URL:** `POST /api/products`  
**Header:** `Authorization: Bearer <token>`

**Request Body (JSON):**
```json
{
  "name": "Wireless Mouse",
  "price": 599,
  "description": "USB wireless mouse",
  "category": "Electronics",
  "stock": 10
}
```

**Response (JSON):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "_id": "PRODUCT_ID",
    "name": "Wireless Mouse",
    "price": 599,
    "description": "USB wireless mouse",
    "category": "Electronics",
    "stock": 10,
    "createdBy": "USER_ID",
    "createdAt": "DATE_TIME",
    "updatedAt": "DATE_TIME"
  }
}
```

### B) GET Products (Get All Products)
**URL:** `GET /api/products`

**Response (JSON):**
```json
{
  "success": true,
  "count": 1,
  "products": [
    {
      "_id": "PRODUCT_ID",
      "name": "Wireless Mouse",
      "price": 599,
      "category": "Electronics",
      "stock": 10
    }
  ]
}
```

### C) Login Response (Token Example)
**URL:** `POST /api/auth/login`

**Response (JSON):**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "token": "JWT_TOKEN_HERE",
  "user": {
    "id": "USER_ID",
    "name": "Student Name",
    "email": "student@gmail.com"
  }
}
```

---

## 8) Authentication Method (JWT in Simple Steps)
1. User registers or logs in using email and password.
2. Server checks details and generates a JWT token.
3. Token is sent back in the login/register response.
4. For protected routes (create/update/delete product), user sends token in header:
   - `Authorization: Bearer <token>`
5. Server verifies token using secret key.
6. If token is valid, request is allowed. Otherwise, it returns error.

---

## 9) Screenshots to Add (Practical File)
Add screenshots of the following:
1. Postman: Register request + response
2. Postman: Login request + token response
3. Postman: Create product request + response (with token)
4. Postman: Get all products response
5. MongoDB Compass: `users` collection data
6. MongoDB Compass: `products` collection data
7. Terminal/Command Prompt: Server running (`npm run dev`) and showing logs

---

## 10) Challenges Faced
- MongoDB connection issue (fixed by checking MongoDB URI and starting MongoDB service)
- Token not working in protected route (fixed by sending token in correct header format)
- Validation errors in product fields (fixed by sending proper JSON data)

All issues were resolved successfully.

---

## 11) Conclusion
This project helped me learn how to create REST APIs using Node.js and Express, connect MongoDB using Mongoose, and implement user login using JWT. I also learned how to test APIs using Postman and handle basic validations and errors.

