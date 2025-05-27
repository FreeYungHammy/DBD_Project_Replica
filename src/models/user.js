// setting up mongoose schema for users 
const mongoose = require('mongoose');
const { Schema } = mongoose;

// defining the schema 
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
  address: {
    street: String,
    city: String,
    zip: String,
    country: String
  },
  phone: String,
  createdAt: { type: Date, default: Date.now }
});

// exporting the model from the schema
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
