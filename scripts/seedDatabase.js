require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const User = require('../src/models/user');
const Product = require('../src/models/product');
const Category = require('../src/models/categories');
const Review = require('../src/models/reviews');
const Cart = require('../src/models/carts');
const Order = require('../src/models/order');

async function seeding() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
      Review.deleteMany({}),
      Cart.deleteMany({}),
      Order.deleteMany({})
    ]);

    // seed Users
    const users = await User.insertMany([
      {
        name: "Alice Smith",
        email: "alice@example.com",
        password: "secure123",
        role: "buyer"
      },
      {
        name: "Bob Seller",
        email: "bob@example.com",
        password: "secure456",
        role: "seller"
      }
    ]);

    // seed Categories
    const categories = await Category.insertMany([
      { name: "Jewelry", description: "Handmade accessories" },
      { name: "Clothing", description: "Hand-stitched apparel" }
    ]);

    // seed Products
    const products = await Product.insertMany([
      {
        name: "Silver Necklace",
        description: "Beautiful handcrafted silver necklace",
        price: 49.99,
        stock: 25,
        categoryId: categories[0]._id,
        sellerId: users[1]._id
      },
      {
        name: "Cotton Shirt",
        description: "Soft cotton shirt in multiple sizes",
        price: 29.99,
        stock: 50,
        categoryId: categories[1]._id,
        sellerId: users[1]._id
      }
    ]);

    // seed Orders
    await Order.insertMany([
      {
        userId: users[0]._id,
        items: [
          {
            productId: products[1]._id,
            quantity: 2,
            price: 29.99
          }
        ],
        total: 59.98,
        paymentMethod: "Credit Card",
        status: "shipped",
        shippingAddress: {
          street: "456 Another St",
          city: "Cape Town",
          zip: "8000",
          country: "South Africa"
        }
      }
    ]);

    // seed Reviews
    await Review.insertMany([
      {
        userId: users[0]._id,
        productId: products[0]._id,
        rating: 5,
        comment: "Absolutely stunning!"
      }
    ]);

    // seed Carts
    await Cart.insertMany([
      {
        userId: users[0]._id,
        items: [
          { productId: products[1]._id, quantity: 2 }
        ]
      }
    ]);

    console.log("Database seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seeding();
