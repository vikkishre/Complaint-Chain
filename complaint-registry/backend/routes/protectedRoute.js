const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

router.get('/protected-route', authenticateToken, (req, res) => {
  res.json({ message: 'You are authorized', user: req.user });
});

module.exports = router;
