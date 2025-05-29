const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import your models (adjust paths as needed)
const User = require('../src/models/user');
const Category = require('../src/models/categories');
const Product = require('../src/models/product');
const Cart = require('../src/models/carts');
const Order = require('../src/models/order');
const Review = require('../src/models/reviews');

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Clear existing data
async function clearDatabase() {
  try {
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    console.log('Database cleared');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
}

// Seed Users
async function seedUsers() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = [
    {
      name: 'John Smith',
      email: 'john.smith@email.com',
      passwordHash: hashedPassword,
      role: 'buyer',
      address: {
        street: '123 Main Street',
        city: 'Cape Town',
        zip: '8001',
        country: 'South Africa'
      },
      phone: '+27 21 123 4567'
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      passwordHash: hashedPassword,
      role: 'seller',
      address: {
        street: '456 Oak Avenue',
        city: 'Johannesburg',
        zip: '2001',
        country: 'South Africa'
      },
      phone: '+27 11 987 6543'
    },
    {
      name: 'Mike Wilson',
      email: 'mike.wilson@email.com',
      passwordHash: hashedPassword,
      role: 'seller',
      address: {
        street: '789 Pine Road',
        city: 'Durban',
        zip: '4001',
        country: 'South Africa'
      },
      phone: '+27 31 555 0123'
    },
    {
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      passwordHash: hashedPassword,
      role: 'buyer',
      address: {
        street: '321 Elm Street',
        city: 'Pretoria',
        zip: '0001',
        country: 'South Africa'
      },
      phone: '+27 12 444 5678'
    },
    {
      name: 'Admin User',
      email: 'admin@email.com',
      passwordHash: hashedPassword,
      role: 'admin',
      address: {
        street: '999 Admin Lane',
        city: 'Cape Town',
        zip: '8000',
        country: 'South Africa'
      },
      phone: '+27 21 000 0000'
    }
  ];

  const createdUsers = await User.insertMany(users);
  console.log(`${createdUsers.length} users created`);
  return createdUsers;
}

// Seed Categories
async function seedCategories() {
  const categories = [
    {
      name: 'Electronics',
      description: 'Electronic devices and accessories'
    },
    {
      name: 'Clothing',
      description: 'Fashion and apparel for all ages'
    },
    {
      name: 'Books',
      description: 'Books, magazines, and educational materials'
    },
    {
      name: 'Home & Garden',
      description: 'Home improvement and gardening supplies'
    },
    {
      name: 'Sports & Outdoors',
      description: 'Sports equipment and outdoor gear'
    },
    {
      name: 'Beauty & Health',
      description: 'Personal care and health products'
    }
  ];

  const createdCategories = await Category.insertMany(categories);
  console.log(`${createdCategories.length} categories created`);
  return createdCategories;
}

// Seed Products
async function seedProducts(users, categories) {
  const sellers = users.filter(user => user.role === 'seller');
  const electronicsCategory = categories.find(cat => cat.name === 'Electronics');
  const clothingCategory = categories.find(cat => cat.name === 'Clothing');
  const booksCategory = categories.find(cat => cat.name === 'Books');
  const homeCategory = categories.find(cat => cat.name === 'Home & Garden');
  const sportsCategory = categories.find(cat => cat.name === 'Sports & Outdoors');
  const beautyCategory = categories.find(cat => cat.name === 'Beauty & Health');

  const products = [
    {
      sellerId: sellers[0]._id,
      name: 'Samsung Galaxy Smartphone',
      description: 'Latest Android smartphone with advanced camera features and long-lasting battery life.',
      price: 8999.99,
      currency: 'ZAR',
      stock: 25,
      categoryId: electronicsCategory._id,
      tags: ['smartphone', 'android', 'samsung', 'mobile'],
      images: ['smartphone1.jpg', 'smartphone2.jpg'],
      ratings: { average: 4.5, count: 12 }
    },
    {
      sellerId: sellers[1]._id,
      name: 'Wireless Bluetooth Headphones',
      description: 'Premium noise-cancelling wireless headphones with superior sound quality.',
      price: 1299.99,
      currency: 'ZAR',
      stock: 50,
      categoryId: electronicsCategory._id,
      tags: ['headphones', 'bluetooth', 'wireless', 'audio'],
      images: ['headphones1.jpg'],
      ratings: { average: 4.8, count: 24 }
    },
    {
      sellerId: sellers[0]._id,
      name: 'Cotton T-Shirt',
      description: 'Comfortable 100% cotton t-shirt available in multiple colors and sizes.',
      price: 199.99,
      currency: 'ZAR',
      stock: 100,
      categoryId: clothingCategory._id,
      tags: ['t-shirt', 'cotton', 'casual', 'clothing'],
      images: ['tshirt1.jpg', 'tshirt2.jpg', 'tshirt3.jpg'],
      ratings: { average: 4.2, count: 8 }
    },
    {
      sellerId: sellers[1]._id,
      name: 'JavaScript Programming Guide',
      description: 'Comprehensive guide to modern JavaScript development with practical examples.',
      price: 449.99,
      currency: 'ZAR',
      stock: 30,
      categoryId: booksCategory._id,
      tags: ['javascript', 'programming', 'web development', 'education'],
      images: ['jsbook1.jpg'],
      ratings: { average: 4.9, count: 15 }
    },
    {
      sellerId: sellers[0]._id,
      name: 'Garden Tools Set',
      description: 'Complete set of essential gardening tools including spade, rake, and pruners.',
      price: 699.99,
      currency: 'ZAR',
      stock: 20,
      categoryId: homeCategory._id,
      tags: ['gardening', 'tools', 'outdoor', 'plants'],
      images: ['gardentools1.jpg', 'gardentools2.jpg'],
      ratings: { average: 4.3, count: 6 }
    },
    {
      sellerId: sellers[1]._id,
      name: 'Yoga Mat',
      description: 'High-quality non-slip yoga mat perfect for all types of yoga and exercise.',
      price: 299.99,
      currency: 'ZAR',
      stock: 75,
      categoryId: sportsCategory._id,
      tags: ['yoga', 'exercise', 'fitness', 'mat'],
      images: ['yogamat1.jpg'],
      ratings: { average: 4.6, count: 18 }
    },
    {
      sellerId: sellers[0]._id,
      name: 'Organic Face Cream',
      description: 'Natural organic face cream with anti-aging properties and moisturizing benefits.',
      price: 349.99,
      currency: 'ZAR',
      stock: 40,
      categoryId: beautyCategory._id,
      tags: ['skincare', 'organic', 'face cream', 'beauty'],
      images: ['facecream1.jpg'],
      ratings: { average: 4.7, count: 22 }
    },
    {
      sellerId: sellers[1]._id,
      name: 'Laptop Backpack',
      description: 'Durable laptop backpack with multiple compartments and water-resistant material.',
      price: 899.99,
      currency: 'ZAR',
      stock: 35,
      categoryId: electronicsCategory._id,
      tags: ['backpack', 'laptop', 'travel', 'accessories'],
      images: ['backpack1.jpg', 'backpack2.jpg'],
      ratings: { average: 4.4, count: 10 }
    }
  ];

  const createdProducts = await Product.insertMany(products);
  console.log(`${createdProducts.length} products created`);
  return createdProducts;
}

// Seed Carts
async function seedCarts(users, products) {
  const buyers = users.filter(user => user.role === 'buyer');
  
  const carts = [
    {
      userId: buyers[0]._id,
      items: [
        { productId: products[0]._id, quantity: 1 },
        { productId: products[2]._id, quantity: 2 }
      ]
    },
    {
      userId: buyers[1]._id,
      items: [
        { productId: products[1]._id, quantity: 1 },
        { productId: products[5]._id, quantity: 1 },
        { productId: products[6]._id, quantity: 1 }
      ]
    }
  ];

  const createdCarts = await Cart.insertMany(carts);
  console.log(`${createdCarts.length} carts created`);
  return createdCarts;
}

// Seed Orders
async function seedOrders(users, products) {
  const buyers = users.filter(user => user.role === 'buyer');
  
  const orders = [
    {
      userId: buyers[0]._id,
      items: [
        {
          productId: products[3]._id,
          name: products[3].name,
          quantity: 1,
          price: products[3].price
        }
      ],
      status: 'paid',
      paymentMethod: 'Credit Card',
      total: products[3].price,
      shippingAddress: {
        street: '123 Main Street',
        city: 'Cape Town',
        zip: '8001',
        country: 'South Africa'
      }
    },
    {
      userId: buyers[1]._id,
      items: [
        {
          productId: products[4]._id,
          name: products[4].name,
          quantity: 1,
          price: products[4].price
        },
        {
          productId: products[7]._id,
          name: products[7].name,
          quantity: 1,
          price: products[7].price
        }
      ],
      status: 'shipped',
      paymentMethod: 'EFT',
      total: products[4].price + products[7].price,
      shippingAddress: {
        street: '321 Elm Street',
        city: 'Pretoria',
        zip: '0001',
        country: 'South Africa'
      }
    },
    {
      userId: buyers[0]._id,
      items: [
        {
          productId: products[1]._id,
          name: products[1].name,
          quantity: 2,
          price: products[1].price
        }
      ],
      status: 'pending',
      paymentMethod: 'PayPal',
      total: products[1].price * 2,
      shippingAddress: {
        street: '123 Main Street',
        city: 'Cape Town',
        zip: '8001',
        country: 'South Africa'
      }
    }
  ];

  const createdOrders = await Order.insertMany(orders);
  console.log(`${createdOrders.length} orders created`);
  return createdOrders;
}

// Seed Reviews
async function seedReviews(users, products) {
  const buyers = users.filter(user => user.role === 'buyer');
  
  const reviews = [
    {
      productId: products[0]._id,
      userId: buyers[0]._id,
      rating: 5,
      comment: 'Excellent smartphone! Great camera quality and battery life.'
    },
    {
      productId: products[1]._id,
      userId: buyers[1]._id,
      rating: 5,
      comment: 'Amazing sound quality and very comfortable to wear.'
    },
    {
      productId: products[2]._id,
      userId: buyers[0]._id,
      rating: 4,
      comment: 'Good quality t-shirt, fits well and comfortable fabric.'
    },
    {
      productId: products[3]._id,
      userId: buyers[1]._id,
      rating: 5,
      comment: 'Comprehensive guide with clear explanations and great examples.'
    },
    {
      productId: products[4]._id,
      userId: buyers[0]._id,
      rating: 4,
      comment: 'Good quality tools, perfect for my garden needs.'
    },
    {
      productId: products[5]._id,
      userId: buyers[1]._id,
      rating: 5,
      comment: 'Perfect yoga mat! Non-slip surface and great cushioning.'
    },
    {
      productId: products[6]._id,
      userId: buyers[0]._id,
      rating: 4,
      comment: 'Nice face cream, makes my skin feel soft and moisturized.'
    }
  ];

  const createdReviews = await Review.insertMany(reviews);
  console.log(`${createdReviews.length} reviews created`);
  return createdReviews;
}

// Main seeding function
async function seedDatabase() {
  try {
    await connectDB();
    console.log(`Connected to MongoDB at ${mongoose.connection.name}`);
    await clearDatabase();
    
    console.log('Starting database seeding');
    
    const users = await seedUsers();
    const categories = await seedCategories();
    const products = await seedProducts(users, categories);
    const carts = await seedCarts(users, products);
    const orders = await seedOrders(users, products);
    const reviews = await seedReviews(users, products);
    
    console.log('Database seeding completed successfully!');
    console.log('Summary:');
    console.log(`- ${users.length} users`);
    console.log(`- ${categories.length} categories`);
    console.log(`- ${products.length} products`);
    console.log(`- ${carts.length} carts`);
    console.log(`- ${orders.length} orders`);
    console.log(`- ${reviews.length} reviews`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
}

// Run the seeding
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;