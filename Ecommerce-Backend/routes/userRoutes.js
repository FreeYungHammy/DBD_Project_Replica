const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');

// GET all users 
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST register new user
router.post('/', async (req, res) => {
  const {
    name,
    email,
    password,
    role = 'buyer',
    address = {},
    phone = ''
  } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: 'Name, email and password are required.' });
  }

  try {
    // Check unique email
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Build user doc
    const user = new User({
      name,
      email,
      passwordHash,
      role,
      address: {
        street: address.street || '',
        city: address.city || '',
        zip: address.zip || '',
        country: address.country || ''
      },
      phone
    });

    await user.save();

    // Return safe public fields
    res.status(201).json({
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      phone: user.phone,
      createdAt: user.createdAt
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Compare password
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    // Respond with user data (omit the hash)
    res.json({
      userId:   user._id,
      name:     user.name,
      email:    user.email,
      role:     user.role,
      address:  user.address,
      phone:    user.phone,
      createdAt:user.createdAt
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found.' });
    }
    // you can send back the deleted user or just a success message
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error during deletion.' });
  }
});

router.put('/:id', async (req, res) => {
  const { name, email, role } = req.body;
  try {
    // findByIdAndUpdate with { new: true } so it returns the updated doc
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select('-passwordHash');
    if (!updated) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(updated);
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ message: 'Server error during update.' });
  }
});


module.exports = router;