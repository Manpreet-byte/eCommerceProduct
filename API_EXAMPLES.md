# API Examples - cURL Commands & Responses

Quick reference with exact commands and responses.

## 🔐 Authentication Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Save this token for authenticated requests!**

---

## 📦 Product Examples

### Get All Products (No filters)
```bash
curl -X GET http://localhost:5000/api/products
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "products": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
      "name": "Laptop",
      "price": 999.99,
      "description": "Gaming laptop",
      "category": "Electronics",
      "stock": 10,
      "createdBy": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Filter by Category
```bash
curl -X GET "http://localhost:5000/api/products?category=Electronics"
```

---

### Search by Name
```bash
curl -X GET "http://localhost:5000/api/products?search=laptop"
```

---

### Sort by Price (Ascending)
```bash
curl -X GET "http://localhost:5000/api/products?sortBy=price-asc"
```

---

### Combined: Category + Price Range + Sort
```bash
curl -X GET "http://localhost:5000/api/products?category=Electronics&minPrice=500&maxPrice=1500&sortBy=price-asc"
```

---

### Get Single Product
```bash
curl -X GET http://localhost:5000/api/products/64a1b2c3d4e5f6g7h8i9j0k2
```

**Response (200):**
```json
{
  "success": true,
  "product": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
    "name": "Laptop",
    "price": 999.99,
    "description": "Gaming laptop",
    "category": "Electronics",
    "stock": 10,
    "createdBy": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Create Product (Protected)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphone",
    "price": 799.99,
    "description": "Latest 5G smartphone",
    "category": "Electronics",
    "stock": 50
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
    "name": "Smartphone",
    "price": 799.99,
    "description": "Latest 5G smartphone",
    "category": "Electronics",
    "stock": 50,
    "createdBy": "64a1b2c3d4e5f6g7h8i9j0k1",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### Update Product (Protected - Only Creator)
```bash
curl -X PUT http://localhost:5000/api/products/64a1b2c3d4e5f6g7h8i9j0k3 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "price": 749.99,
    "stock": 45
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "product": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
    "name": "Smartphone",
    "price": 749.99,
    "description": "Latest 5G smartphone",
    "category": "Electronics",
    "stock": 45,
    "createdBy": "64a1b2c3d4e5f6g7h8i9j0k1",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:15:00.000Z"
  }
}
```

---

### Delete Product (Protected - Only Creator)
```bash
curl -X DELETE http://localhost:5000/api/products/64a1b2c3d4e5f6g7h8i9j0k3 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## ❌ Error Examples

### Missing Token (Protected Route)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop", "price": 999.99}'
```

**Response (401):**
```json
{
  "success": false,
  "message": "No token, authorization denied"
}
```

---

### Invalid Token
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer invalid_token_here" \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop", "price": 999.99}'
```

**Response (401):**
```json
{
  "success": false,
  "message": "Token is not valid"
}
```

---

### User Not Authorized (Updating Another User's Product)
```bash
# User A created product
# User B tries to update it
curl -X PUT http://localhost:5000/api/products/64a1b2c3d4e5f6g7h8i9j0k2 \
  -H "Authorization: Bearer user_b_token" \
  -H "Content-Type: application/json" \
  -d '{"price": 500}'
```

**Response (403):**
```json
{
  "success": false,
  "message": "Not authorized to update this product"
}
```

---

### Missing Required Fields
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe"}'
```

**Response (400):**
```json
{
  "success": false,
  "message": "Please provide name, email, and password"
}
```

---

### Product Not Found
```bash
curl -X GET http://localhost:5000/api/products/invalid_id_12345
```

**Response (404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### Duplicate Email (User Already Exists)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response (400):** (if email already registered)
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

---

### Invalid Credentials (Wrong Password)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "wrong_password"
  }'
```

**Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

## 🔧 Query Parameter Combinations

### Price Range
```bash
# Between $100 and $1000
curl -X GET "http://localhost:5000/api/products?minPrice=100&maxPrice=1000"

# Over $500
curl -X GET "http://localhost:5000/api/products?minPrice=500"

# Under $300
curl -X GET "http://localhost:5000/api/products?maxPrice=300"
```

---

### Sort Options
```bash
# Lowest price first
curl -X GET "http://localhost:5000/api/products?sortBy=price-asc"

# Highest price first
curl -X GET "http://localhost:5000/api/products?sortBy=price-desc"

# Alphabetical order
curl -X GET "http://localhost:5000/api/products?sortBy=name"

# Newest first (default)
curl -X GET "http://localhost:5000/api/products"
```

---

### Complete Example (Everything)
```bash
curl -X GET "http://localhost:5000/api/products?category=Electronics&search=phone&minPrice=200&maxPrice=1000&sortBy=price-asc"
```

This would return: 
- Only Electronics products
- Containing "phone" in name
- Priced between $200-$1000
- Sorted by lowest price first

---

## 📝 Tips & Tricks

### 1. Save Bearer Token for reuse in bash
```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass"}' | jq -r '.token')

# Now use it
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Product","price":99.99}'
```

### 2. Pretty print JSON response
```bash
curl -X GET http://localhost:5000/api/products | jq .
```

### 3. Get only the token
```bash
curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass"}' | jq -r '.token'
```

### 4. Get response headers
```bash
curl -i -X GET http://localhost:5000/api/products
```

### 5. Save response to file
```bash
curl -X GET http://localhost:5000/api/products > products.json
```

---

**Still learning?** Check README.md for complete documentation!
