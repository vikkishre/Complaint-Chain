const express = require('express');
const svgCaptcha = require('svg-captcha');

const router = express.Router();

router.get('/captcha', (req, res) => {
  const captcha = svgCaptcha.create({
    size: 5,
    noise: 3,
    color: true,
    background: '#f2f2f2'
  });

  req.session.captcha = captcha.text;
  res.type('svg');
  res.send(captcha.data);
});

router.post('/verify-captcha', (req, res) => {
  const { userCaptcha } = req.body;
  if (userCaptcha === req.session.captcha) {
    return res.json({ success: true });
  }
  res.json({ success: false });
});

module.exports = router;
