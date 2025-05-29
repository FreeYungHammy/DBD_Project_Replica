const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

module.exports = app; 
