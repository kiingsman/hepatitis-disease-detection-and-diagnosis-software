const express = require('express');
const { login, register, me } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { requireFields } = require('../middleware/validate');

const router = express.Router();

router.post('/login', requireFields(['email', 'password']), login);
router.post('/register', protect, requireFields(['fullname', 'email', 'password']), register);
router.get('/me', protect, me);

module.exports = router;
