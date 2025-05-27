// setting up mongoose schema for users 
const mongoose = require('mongoose');
const { Schema } = mongoose;

// defining the schema 
const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [cartItemSchema],
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// exporting the model from the schema
module.exports = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
