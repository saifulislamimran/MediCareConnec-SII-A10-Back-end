const express = require('express');
const { uploadEHRDocument } = require('../controllers/extraController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);
router.post('/upload', uploadEHRDocument);

module.exports = router;
