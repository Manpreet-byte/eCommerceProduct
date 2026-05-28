# 📚 Project Files Index & Guide

Complete guide to all files in the E-commerce Product Catalog API project.

---

## 🎯 START HERE

1. **First Time?** → Read [`QUICK_START.md`](#quick-startmd)
2. **Need Overview?** → Read [`PROJECT_SUMMARY.md`](#project-summarymd)
3. **Full Documentation?** → Read [`README.md`](#readmemd)
4. **Want Examples?** → Check [`API_EXAMPLES.md`](#api-examplesmd)
5. **Writing Practical File?** → Use [`PRACTICAL_FILE.md`](#practical-filemd)

---

## 📄 Configuration Files

### `package.json`
**Purpose:** Project metadata and dependencies

**Contains:**
- Project name, version, description
- npm scripts: `start`, `dev`
- All required dependencies
- devDependencies for development

**When to edit:** 
- Add new npm packages
- Change scripts
- Update version

---

### `.env`
**Purpose:** Environment variables (NEVER commit to git)

**Contains:**
- `PORT`: Server port (default 5000)
- `MONGODB_URI`: Database connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRE`: Token expiration time
- `NODE_ENV`: Environment (development/production)

**Setup:**
```bash
# Copy from template
cp .env.example .env

# Edit with your values
nano .env
```

**⚠️ Important:** Add to `.gitignore` to prevent exposing secrets!

---

### `.env.example`
**Purpose:** Template for `.env` (safe to commit)

**Shows:** All required environment variables with examples

**Usage:** Copy this to `.env` and fill in your values

---

### `.gitignore`
**Purpose:** Tell git which files to ignore

**Contains:** 
- node_modules/
- .env files
- IDE files (.vscode, .idea)
- OS files (.DS_Store, Thumbs.db)
- Logs

---

## 📖 Documentation Files

### `README.md`
**Purpose:** Complete API documentation

**Includes:**
- Features overview
- Installation & setup steps
- Full API endpoint documentation
- Error responses
- Testing with Postman
- Deployment instructions
- Technology stack
- Troubleshooting

**Read when:** Need detailed information about any aspect

---

### `QUICK_START.md`
**Purpose:** Get running in 5 minutes

**Includes:**
- Prerequisites check
- 5-step setup process
- Quick Postman testing guide
- Common issues & solutions
- API quick reference table

**Read when:** Want to start immediately

---

### `PROJECT_SUMMARY.md`
**Purpose:** Overview of what's been built

**Includes:**
- Project structure
- Features implemented checklist
- Quick start recap
- Database schemas
- Testing checklist
- Deployment checklist
- Viva-friendly explanations

**Read when:** Want high-level overview

---

### `API_EXAMPLES.md`
**Purpose:** Real examples with cURL commands & responses

**Includes:**
- cURL commands for all endpoints
- Exact request & response bodies
- Error examples
- Query parameter combinations
- Bash tips & tricks

**Read when:** Want to copy-paste examples

---

### `PRACTICAL_FILE.md`
**Purpose:** Practical file write-up (student-friendly)

**Includes:**
- Objective, tools used, and simple architecture
- MVC folder structure
- User and Product schema explanation
- Endpoint list (without code)
- Sample requests and responses
- JWT authentication steps
- Screenshots list, challenges, and conclusion

**Read when:** Preparing BCA practical file / viva

---

### `INDEX.md` (This File!)
**Purpose:** Guide to all project files

**Includes:**
- File descriptions
- When to read each file
- File structure guide

---

## 💻 Source Code Files

### `server.js`
**Purpose:** Main application entry point

**What it does:**
1. Loads environment variables
2. Connects to MongoDB
3. Sets up middleware (CORS, JSON parser, logger)
4. Registers routes
5. Starts HTTP server on PORT

**Key lines:**
```javascript
const app = express();
connectDB();                          // Connect to MongoDB
app.use(cors());                      // Enable CORS
app.use('/api/auth', authRoutes);    // Auth endpoints
app.use('/api/products', productRoutes); // Product endpoints
app.listen(PORT, () => {...});       // Start server
```

**Run with:** `npm start` or `npm run dev`

---

## 📁 `/config` Directory

### `config/db.js`
**Purpose:** MongoDB database connection configuration

**What it does:**
1. Connects to MongoDB using Mongoose
2. Handles connection errors
3. Logs connection status

**Exports:** `connectDB()` function

**Called by:** `server.js`

**Key code:**
```javascript
await mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

---

## 📁 `/models` Directory

### `models/User.js`
**Purpose:** User database schema

**Fields:**
- `name`: User's full name
- `email`: User's email (unique)
- `password`: Hashed password
- `createdAt`: Registration timestamp

**Methods:**
- `matchPassword()`: Compare entered password with hashed

**Middleware:**
- `pre('save')`: Hash password before saving

**Used by:** Authentication controller

---

### `models/Product.js`
**Purpose:** Product database schema

**Fields:**
- `name`: Product name (required)
- `price`: Product price (required)
- `description`: Optional description
- `category`: Product category
- `stock`: Quantity available
- `createdBy`: Reference to User who created
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

**Middleware:**
- `pre('save')`: Update timestamp before saving

**Used by:** Product controller

---

## 📁 `/controllers` Directory

### `controllers/authController.js`
**Purpose:** Authentication logic

**Functions:**
- `register()`: Create new user account
  - Validates input
  - Checks if email exists
  - Hashes password
  - Generates JWT token
  - Returns user & token

- `login()`: Authenticate user
  - Validates credentials
  - Compares password
  - Generates JWT token
  - Returns user & token

**HTTP Status Codes:**
- 201: Registration successful
- 200: Login successful
- 400: Bad request (missing fields)
- 401: Invalid credentials
- 500: Server error

---

### `controllers/productController.js`
**Purpose:** Product CRUD operations

**Functions:**

1. `createProduct()` - POST /api/products
   - Creates new product
   - Requires authentication
   - Associates with current user

2. `getAllProducts()` - GET /api/products
   - Returns all products
   - Supports filtering by category
   - Supports search by name
   - Supports price range filtering
   - Supports sorting

3. `getProductById()` - GET /api/products/:id
   - Returns single product
   - Includes creator details

4. `updateProduct()` - PUT /api/products/:id
   - Updates product
   - Only creator can update
   - Requires authentication

5. `deleteProduct()` - DELETE /api/products/:id
   - Deletes product
   - Only creator can delete
   - Requires authentication

**HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden (not creator)
- 404: Not found
- 500: Server error

---

## 📁 `/middleware` Directory

### `middleware/logger.js`
**Purpose:** Log HTTP requests

**What it does:**
- Logs HTTP method (GET, POST, etc.)
- Logs request URL
- Continues to next middleware

**Output:** 
```
GET /api/products
POST /api/auth/login
```

---

### `middleware/auth.js`
**Purpose:** Verify JWT token for protected routes

**What it does:**
1. Extracts token from Authorization header
2. Verifies token signature
3. Finds user from token
4. Attaches user to request object
5. Continues to controller

**Returns:**
- 200: Token valid, request continues
- 401: No token, invalid token, or user not found

**Header format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

### `middleware/errorHandler.js`
**Purpose:** Centralized error handling

**What it does:**
1. Catches all errors
2. Logs error to console
3. Returns consistent error JSON response

**Response format:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 📁 `/routes` Directory

### `routes/authRoutes.js`
**Purpose:** Define authentication endpoints

**Endpoints:**
- `POST /api/auth/register` → register()
- `POST /api/auth/login` → login()

**Middleware:** None (public routes)

---

### `routes/productRoutes.js`
**Purpose:** Define product endpoints

**Endpoints:**
- `GET /api/products` → getAllProducts() [public]
- `GET /api/products/:id` → getProductById() [public]
- `POST /api/products` → createProduct() [protected by auth middleware]
- `PUT /api/products/:id` → updateProduct() [protected by auth middleware]
- `DELETE /api/products/:id` → deleteProduct() [protected by auth middleware]

**Middleware:** `auth` for create/update/delete

---

## 📄 Other Files

### `postman_collection.json`
**Purpose:** Ready-to-import Postman collection

**Includes:**
- All API endpoints pre-configured
- Authentication endpoints
- Product endpoints with all query options
- Health check endpoint
- Environment variables (base_url, token)

**How to use:**
1. Open Postman
2. File → Import
3. Select this file
4. All endpoints ready to test!

---

## 📊 File Structure Tree

```
E-commerceProductCatalog/
│
├── 📄 server.js ..................... Main entry point
├── 📄 package.json .................. Dependencies & scripts
├── 📄 .env .......................... Environment variables (create from .env.example)
├── 📄 .env.example .................. Template for .env
├── 📄 .gitignore .................... Git ignore rules
│
├── 📄 README.md ..................... Complete documentation
├── 📄 QUICK_START.md ................ 5-minute setup guide
├── 📄 PROJECT_SUMMARY.md ............ Project overview
├── 📄 API_EXAMPLES.md ............... cURL examples
├── 📄 INDEX.md ...................... This file
│
├── 📄 postman_collection.json ....... Postman collection
│
├── 📁 config/
│   └── db.js ........................ MongoDB connection
│
├── 📁 models/
│   ├── User.js ..................... User schema
│   └── Product.js .................. Product schema
│
├── 📁 controllers/
│   ├── authController.js ........... Auth logic
│   └── productController.js ........ Product CRUD logic
│
├── 📁 routes/
│   ├── authRoutes.js ............... Auth endpoints
│   └── productRoutes.js ............ Product endpoints
│
└── 📁 middleware/
    ├── logger.js ................... Request logger
    ├── auth.js ..................... JWT verification
    └── errorHandler.js ............. Error handling
```

---

## 🔄 Data Flow Diagram

### Registration/Login Flow
```
User Request (email, password)
    ↓
authRoutes.js (route handler)
    ↓
authController.js (register/login)
    ↓
User Model (find/create user)
    ↓
bcryptjs (hash password)
    ↓
JWT (generate token)
    ↓
Response (token + user data)
```

### Product Creation Flow
```
User Request (with JWT token)
    ↓
productRoutes.js (route handler)
    ↓
auth middleware (verify token)
    ↓
productController.js (createProduct)
    ↓
Product Model (create record)
    ↓
MongoDB (store data)
    ↓
Response (created product)
```

### Product Query Flow
```
User Request (with filters, sort, search)
    ↓
productRoutes.js (route handler)
    ↓
productController.js (getAllProducts)
    ↓
Build MongoDB filter object
    ↓
Build MongoDB sort object
    ↓
Product Model.find().sort()
    ↓
MongoDB (query with filters)
    ↓
Response (filtered products)
```

---

## 🎯 Reading Guide by Task

### "I want to run the project"
1. `QUICK_START.md` ← Start here
2. `.env.example` ← Copy to `.env`
3. `server.js` ← Understand entry point

### "I want to test APIs"
1. `QUICK_START.md` ← Setup
2. `API_EXAMPLES.md` ← Copy cURL commands
3. `postman_collection.json` ← Import to Postman

### "I want to understand the code"
1. `PROJECT_SUMMARY.md` ← Overview
2. `server.js` ← Entry point
3. `controllers/*.js` ← Business logic
4. `routes/*.js` ← URL mappings
5. `models/*.js` ← Data structure

### "I want to modify the code"
1. `README.md` ← Understand architecture
2. Relevant controller file ← Make changes
3. Test with `QUICK_START.md` checklist

### "I want to deploy it"
1. `README.md` → "Deployment to Render" section
2. `server.js` → Ensure using `process.env.PORT`
3. `.env` → Setup all variables

### "I need to explain it (Viva)"
1. `PROJECT_SUMMARY.md` → "Viva Questions" section
2. Read code comments in source files
3. Understand data flow section above

---

## 📋 Checklist: Before Submitting

- [ ] All files created ✅
- [ ] `.env` configured with your MongoDB URI
- [ ] `npm install` completed
- [ ] MongoDB is running
- [ ] `npm run dev` starts without errors
- [ ] Can register user in Postman
- [ ] Can login and get token
- [ ] Can create product with token
- [ ] Can get all products
- [ ] Can filter/search/sort products
- [ ] Can update own product
- [ ] Can delete own product
- [ ] Cannot update other's product
- [ ] All endpoints tested

---

## 🚀 Next Steps

1. ✅ Read `QUICK_START.md`
2. ✅ Run setup commands
3. ✅ Test with Postman collection
4. ✅ Read `README.md` for details
5. ✅ Deploy to Render

---

**Happy coding! 🎉**
