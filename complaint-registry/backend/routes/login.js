const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path as needed

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Step 1: Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Step 2: Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Step 3: Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '1h' }
    );

    // Step 4: Send token and username
    res.json({ 
      message: 'Login successful', 
      token,
      username: user.username // assuming there's a "username" field in your User schema
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
