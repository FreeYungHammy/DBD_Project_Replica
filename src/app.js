require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// hello testing 123
require('./models/user');
require('./models/product');
require('./models/order');
require('./models/reviews');
require('./models/categories');
require('./models/carts');

// app initialization
const app = express();
app.use(express.json());

// mongoDB Connection
mongoose.connect(process.env.MONGO_URI, {})
.then(() => console.log("Connected to MongoDB"))
.catch(err => {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1); //exit if connection fails 
});

// routes
app.get('/', (req, res) => {
  res.send('API is running');
});

const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/products', productRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/orders', orderRoutes);

const reviewRoutes = require('./routes/reviewRoutes');
app.use('/reviews', reviewRoutes);

const categoryRoutes = require('./routes/categoryRoutes');
app.use('/categories', categoryRoutes);

const cartRoutes = require('./routes/cartRoutes');
app.use('/carts', cartRoutes);

// port 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
