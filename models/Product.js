// models/Product.js
// Product schema for e-commerce catalog

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Product name - required
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  // Product price - required
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  // Product description
  description: {
    type: String,
    trim: true,
  },
  // Product category
  category: {
    type: String,
    trim: true,
  },
  // Stock quantity available
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  // ID of user who created this product
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Timestamp when product was created
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Timestamp when product was last updated
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt before saving
productSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);
