// setting up mongoose schema 
const mongoose = require('mongoose');
const { Schema } = mongoose;

// defining the schema 
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // categories should not repeat
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

// exporting the model from the schema
module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);
