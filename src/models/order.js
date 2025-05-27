// setting up mongoose schema for users 
const mongoose = require('mongoose');
const { Schema } = mongoose;

// defining the schema 
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'EFT', 'PayPal', 'Cash on Delivery'],
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    street: String,
    city: String,
    zip: String,
    country: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// exporting the model from the schema
module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);

