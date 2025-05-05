const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/User') // Your Mongoose User model

router.post('/signup', async (req, res) => {
  const { username, email, password, role } = req.body

  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role, // 'register' or 'handler'
    })

    await newUser.save()

    res.status(201).json({ message: 'User registered successfully' })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
