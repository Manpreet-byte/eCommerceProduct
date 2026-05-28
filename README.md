# E-commerce Product Catalog API

A complete RESTful API for an e-commerce product catalog built with Node.js, Express, and MongoDB.

## Features

- **Product Management**: Create, read, update, and delete products
- **User Authentication**: User registration and login with JWT tokens
- **Advanced Search**: Filter by category, search by name, sort by price
- **Protected Routes**: Only authenticated users can create/update/delete products
- **MongoDB Integration**: Using Mongoose for database operations
- **Error Handling**: Comprehensive error handling middleware
- **Request Logging**: All HTTP requests are logged

## Project Structure

```
E-commerceProductCatalog/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── controllers/
│   ├── authController.js     # User authentication logic
│   └── productController.js  # Product CRUD operations
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── logger.js            # Request logging middleware
│   └── errorHandler.js      # Error handling middleware
├── models/
│   ├── User.js              # User schema with password hashing
│   └── Product.js           # Product schema
├── routes/
│   ├── authRoutes.js        # Authentication endpoints
│   └── productRoutes.js     # Product endpoints
├── PRACTICAL_FILE.md        # Student practical file write-up
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies
└── server.js               # Main server file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud like MongoDB Atlas)
- Postman (for API testing)

### Steps

1. **Clone or navigate to the project directory:**
   ```bash
   cd E-commerceProductCatalog
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Edit `.env` file
   - Replace `MONGODB_URI` with your MongoDB connection string
   - Replace `JWT_SECRET` with a strong secret key

   Example:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecommerce-catalog
   JWT_SECRET=my_super_secret_key_12345
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Start MongoDB:**
   - If using local MongoDB:
     ```bash
     mongod
     ```
   - Or use MongoDB Atlas (cloud) connection string

5. **Run the server:**
   ```bash
   # Development mode (with hot reload)
   npm run dev

   # Production mode
   npm start
   ```

   You should see: `Server is running on port 5000`

## Smoke Test (Optional)

After starting MongoDB and the server, you can run a quick end-to-end check:

```bash
npm run smoke
```

This will:
- Register a test user
- Create a few sample products
- Test search, filter, sort, and pagination on `GET /api/products`
- Test update and delete on a product (protected routes)

## API Endpoints

### Authentication Endpoints

#### Register User
- **URL**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

#### Login User
- **URL**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "message": "Logged in successfully",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

### Product Endpoints

#### Get All Products
- **URL**: `GET /api/products`
- **Access**: Public
- **Query Parameters** (all optional):
  - `category`: Filter by category (e.g., `?category=Electronics`)
  - `minPrice`: Minimum price filter (e.g., `?minPrice=100`)
  - `maxPrice`: Maximum price filter (e.g., `?maxPrice=500`)
  - `search`: Search by product name (e.g., `?search=laptop`)
  - `sortBy`: Sort options - `price-asc`, `price-desc`, `name` (e.g., `?sortBy=price-asc`)

- **Example**: `GET /api/products?category=Electronics&sortBy=price-asc&minPrice=100`
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "count": 5,
    "products": [
      {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
        "name": "Laptop",
        "price": 999.99,
        "description": "High-end laptop",
        "category": "Electronics",
        "stock": 10,
        "createdBy": {
          "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
          "name": "Admin",
          "email": "admin@example.com"
        },
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
  ```

#### Get Single Product
- **URL**: `GET /api/products/:id`
- **Access**: Public
- **URL Parameter**: `id` (Product MongoDB ID)
- **Example**: `GET /api/products/64a1b2c3d4e5f6g7h8i9j0k1`
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "product": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Laptop",
      "price": 999.99,
      "description": "High-end laptop",
      "category": "Electronics",
      "stock": 10,
      "createdBy": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
        "name": "Admin",
        "email": "admin@example.com"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
  ```

#### Create Product
- **URL**: `POST /api/products`
- **Access**: Private (Requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "name": "Smartphone",
    "price": 799.99,
    "description": "Latest smartphone with 5G",
    "category": "Electronics",
    "stock": 50
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "success": true,
    "message": "Product created successfully",
    "product": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
      "name": "Smartphone",
      "price": 799.99,
      "description": "Latest smartphone with 5G",
      "category": "Electronics",
      "stock": 50,
      "createdBy": "64a1b2c3d4e5f6g7h8i9j0k2",
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  }
  ```

#### Update Product
- **URL**: `PUT /api/products/:id`
- **Access**: Private (Only product creator)
- **Headers**: `Authorization: Bearer <token>`
- **URL Parameter**: `id` (Product ID)
- **Request Body** (all fields optional):
  ```json
  {
    "name": "Updated Smartphone",
    "price": 749.99,
    "stock": 45
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "message": "Product updated successfully",
    "product": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
      "name": "Updated Smartphone",
      "price": 749.99,
      "description": "Latest smartphone with 5G",
      "category": "Electronics",
      "stock": 45,
      "createdBy": "64a1b2c3d4e5f6g7h8i9j0k2",
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:15:00.000Z"
    }
  }
  ```

#### Delete Product
- **URL**: `DELETE /api/products/:id`
- **Access**: Private (Only product creator)
- **Headers**: `Authorization: Bearer <token>`
- **URL Parameter**: `id` (Product ID)
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "message": "Product deleted successfully"
  }
  ```

#### Health Check
- **URL**: `GET /api/health`
- **Access**: Public
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "message": "API is running"
  }
  ```

## Testing with Postman

### Setup Steps:

1. Import `postman/collection.json`
2. Import environment `postman/environment.json` and select it
3. Run requests in order: **Auth → Register (optional) → Login → Products → Create Product** (this sets `token` and `productId` automatically)

Filtering/sorting query params supported by `GET /api/products`:
- `keyword`, `category`, `minPrice`, `maxPrice`, `sort` (e.g. `-price`), `page`, `limit`

## AWS Deployment

- Docker-ready: `Dockerfile` is included for AWS ECS / App Runner / Elastic Beanstalk (Docker).
- Configure env vars in AWS: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `NODE_ENV=production`.
- Health check path: `GET /api/health`.

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide name and price"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token, authorization denied"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized to update this product"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Product not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

## Security Considerations

- Passwords are hashed using bcryptjs with 10 salt rounds
- JWT tokens expire after 7 days (configurable)
- Only authenticated users can create/update/delete products
- Users can only modify their own products
- Sensitive data (passwords, tokens) are never returned in responses

## Deployment to Render

1. **Push to GitHub** (if not already done)
2. **Connect to Render**:
   - Go to https://render.com
   - Create new Web Service
   - Connect GitHub repository
   - Build command: `npm install`
   - Start command: `npm start`

3. **Set Environment Variables** on Render:
   - Add all variables from `.env`
   - Make sure `PORT` is not hardcoded (already using `process.env.PORT`)
   - Set `MONGODB_URI` to your MongoDB Atlas URI

4. **Deploy** and test using the Render URL

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **CORS**: Cross-Origin Resource Sharing
- **dotenv**: Environment variable management

## Code Quality Features

- ✅ Clean MVC architecture
- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Request logging
- ✅ Input validation
- ✅ JWT authentication
- ✅ Password hashing
- ✅ Environment variables for configuration
- ✅ Code comments for clarity
- ✅ No hardcoded sensitive data

## Future Enhancements

- Add product reviews and ratings
- Implement shopping cart functionality
- Add payment gateway integration
- Implement admin dashboard
- Add email notifications
- Implement pagination for products
- Add product image uploads
- Implement user profiles with order history

## Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env`
- Try connection string from MongoDB Atlas

### JWT Token Errors
- Ensure token is included in Authorization header
- Format: `Authorization: Bearer <token>`
- Check if token has expired

### Port Already in Use
- Change `PORT` in `.env` to different value
- Or kill process using the port

## License

ISC

---

**Happy Coding! 🚀**
