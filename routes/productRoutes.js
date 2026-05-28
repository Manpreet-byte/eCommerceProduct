// routes/productRoutes.js
// Product routes for CRUD operations

const express = require('express');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products (public)
router.get('/', getAllProducts);

// @route   GET /api/products/:id
// @desc    Get single product (public)
router.get('/:id', getProductById);

// @route   POST /api/products
// @desc    Create a product (protected)
router.post('/', auth, createProduct);

// @route   PUT /api/products/:id
// @desc    Update a product (protected)
router.put('/:id', auth, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product (protected)
router.delete('/:id', auth, deleteProduct);

module.exports = router;
