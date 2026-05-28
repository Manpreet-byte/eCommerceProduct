# Quick Start Guide

Get the E-commerce Product Catalog API running in 5 minutes!

## Prerequisites
- Node.js installed
- MongoDB running locally OR MongoDB Atlas account
- Postman (for testing)

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Configure Environment Variables

Create a `.env` file in the root directory (or copy `.env.example`):

```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecommerce-catalog
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRE=7d
```

**If using MongoDB Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce-catalog?retryWrites=true&w=majority
```

## Step 3: Ensure MongoDB is Running

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: Use MongoDB Atlas**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get connection string and add to `.env`

## Step 4: Start the Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

You should see:
```
Server is running on port 5000
MongoDB connected successfully
```

## Step 5: Test with Postman

### Option 1: Import Pre-built Collection
1. Open Postman
2. Import → File → Select `postman_collection.json`
3. Update environment variable: `base_url` = `http://localhost:5000`

### Option 2: Manual Testing

1. **Register a User**
   - POST `http://localhost:5000/api/auth/register`
   - Body:
     ```json
     {
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123"
     }
     ```
   - Copy the token from response

2. **Create a Product** (use token from above)
   - POST `http://localhost:5000/api/products`
   - Headers: `Authorization: Bearer <paste_token_here>`
   - Body:
     ```json
     {
       "name": "Laptop",
       "price": 999.99,
       "description": "Gaming laptop",
       "category": "Electronics",
       "stock": 10
     }
     ```

3. **Get All Products**
   - GET `http://localhost:5000/api/products`
   - No headers needed

4. **Search & Filter**
   - GET `http://localhost:5000/api/products?category=Electronics`
   - GET `http://localhost:5000/api/products?search=laptop`
   - GET `http://localhost:5000/api/products?sortBy=price-asc`

## Common Issues & Solutions

### MongoDB Connection Error
**Error**: `MongoDB connection error`
- **Solution**: Start MongoDB or verify `MONGODB_URI` in `.env`

### Port Already in Use
**Error**: `Error: listen EADDRINUSE :::5000`
- **Solution**: Change `PORT` in `.env` or kill process using port 5000

### JWT Token Invalid
**Error**: `Token is not valid`
- **Solution**: 
  - Generate new token by registering/logging in
  - Format header as: `Authorization: Bearer <token>`

### Missing Required Fields
**Error**: `Please provide name and price`
- **Solution**: Include all required fields in request body

## API Quick Reference

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---|---------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login user |
| GET | `/api/products` | ❌ | Get all products |
| GET | `/api/products/:id` | ❌ | Get single product |
| POST | `/api/products` | ✅ | Create product |
| PUT | `/api/products/:id` | ✅ | Update product |
| DELETE | `/api/products/:id` | ✅ | Delete product |

## Next Steps

1. ✅ Server is running - test with Postman
2. 📚 Read [README.md](./README.md) for complete API documentation
3. 🧪 Run smoke test (optional): `npm run smoke`
4. 🚀 Deploy to Render (see README.md for instructions)
5. 💡 Customize for your needs

---

Need help? Check README.md for detailed documentation!
