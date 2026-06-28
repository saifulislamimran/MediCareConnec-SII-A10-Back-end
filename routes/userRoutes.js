const express = require('express');
const { updateUserProfile } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);

router.patch('/profile', updateUserProfile);

module.exports = router;
