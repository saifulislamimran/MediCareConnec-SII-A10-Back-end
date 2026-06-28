const express = require('express');
const {
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);
router.use(verifyRole('patient', 'user'));

router.route('/')
  .post(createReview);

router.route('/:id')
  .put(updateReview)
  .delete(deleteReview);

module.exports = router;
