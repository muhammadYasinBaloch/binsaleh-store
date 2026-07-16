const express = require('express');
const router = express.Router();
const { register, login, getMe, registerAdmin, subscribeNewsletter } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/register-admin', registerAdmin);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/newsletter/subscribe', subscribeNewsletter);

module.exports = router;
