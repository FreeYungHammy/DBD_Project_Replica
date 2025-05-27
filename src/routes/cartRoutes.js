const express = require('express');
const router = express.Router();
const Cart = require('../models/carts');

// create or update a cart for a user
router.post('/add', async (req, res) => {
  const { userId, items } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // updating existing cart
      cart.items = items;
      cart.updatedAt = new Date();
      await cart.save();
      res.json({ message: 'Cart updated successfully', cart });
    } else {
      // or else creating new cart
      cart = new Cart({ userId, items });
      await cart.save();
      res.status(201).json({ message: 'Cart created successfully', cart });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// get a cart by user ID
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// clear cart by ID
router.delete('/:userId', async (req, res) => {
  try {
    const deleted = await Cart.findOneAndDelete({ userId: req.params.userId });
    if (!deleted) return res.status(404).json({ message: 'Cart not found' });
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
