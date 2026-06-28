const express = require('express');
const { createPaymentIntent } = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);

router.post('/create-intent', createPaymentIntent);

module.exports = router;
