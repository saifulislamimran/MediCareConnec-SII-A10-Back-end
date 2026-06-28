const express = require('express');
const { sendReminder } = require('../controllers/extraController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);
router.post('/send', sendReminder);

module.exports = router;
