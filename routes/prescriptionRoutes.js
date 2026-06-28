const express = require('express');
const {
  issuePrescription,
  updatePrescription
} = require('../controllers/prescriptionController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);
router.use(verifyRole('doctor'));

router.route('/')
  .post(issuePrescription);

router.route('/:id')
  .put(updatePrescription);

module.exports = router;
