// controllers/productController.js
// Product controller for product management (CRUD operations)

const Product = require('../models/Product');

const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (only logged-in users)
const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock } = req.body;

    // Validate required fields
    if (!name || price === undefined || price === null) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and price',
      });
    }

    // Create product with user ID
    const product = await Product.create({
      name,
      price,
      description,
      category,
      stock: stock || 0,
      createdBy: req.user.id, // User ID from auth middleware
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, and searching
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      sort,
      page,
      limit,
    } = req.query;

    const query = {};

    // Search (by name OR description) - case-insensitive partial match
    if (keyword && String(keyword).trim()) {
      const safeKeyword = escapeRegExp(String(keyword).trim());
      query.$or = [
        { name: { $regex: safeKeyword, $options: 'i' } },
        { description: { $regex: safeKeyword, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category && String(category).trim()) {
      const safeCategory = escapeRegExp(String(category).trim());
      query.category = { $regex: `^${safeCategory}$`, $options: 'i' };
    }

    // Filter by price range
    const min = minPrice !== undefined ? Number(minPrice) : undefined;
    const max = maxPrice !== undefined ? Number(maxPrice) : undefined;
    const hasMin = min !== undefined && !Number.isNaN(min);
    const hasMax = max !== undefined && !Number.isNaN(max);
    if (hasMin || hasMax) {
      query.price = {};
      if (hasMin) query.price.$gte = min;
      if (hasMax) query.price.$lte = max;
    }

    // Sorting
    // Examples:
    //   ?sort=price   -> ascending
    //   ?sort=-price  -> descending
    const allowedSortFields = new Set(['price', 'createdAt', 'name']);
    let sortObj = { createdAt: -1 }; // default: newest first
    if (sort && String(sort).trim()) {
      const sortValue = String(sort).trim();
      const isDesc = sortValue.startsWith('-');
      const field = isDesc ? sortValue.slice(1) : sortValue;
      if (allowedSortFields.has(field)) {
        sortObj = { [field]: isDesc ? -1 : 1 };
      }
    }

    // Pagination
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Product.countDocuments(query);
    const pages = total === 0 ? 0 : Math.ceil(total / limitNumber);

    const products = await Product.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNumber)
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      count: products.length,
      page: pageNumber,
      pages,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/products/:id
// @desc    Get a single product by ID
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product by ID
    const product = await Product.findById(id).populate('createdBy', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    // Handle invalid MongoDB ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Invalid product ID',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (only logged-in users who created the product)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category, stock } = req.body;

    // Find product by ID
    let product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if user is the creator of the product
    if (product.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product',
      });
    }

    // Update product fields if provided
    if (name) product.name = name;
    if (price !== undefined && price !== null) product.price = price;
    if (description) product.description = description;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;

    // Save updated product
    product = await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Invalid product ID',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (only logged-in users who created the product)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product by ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if user is the creator of the product
    if (product.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product',
      });
    }

    // Delete product
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Invalid product ID',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
