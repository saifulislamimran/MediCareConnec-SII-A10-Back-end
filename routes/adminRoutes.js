const express = require('express');
const {
  getUsers,
  deleteUser,
  suspendUser,
  verifyDoctor,
  getAnalytics
} = require('../controllers/adminController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);
router.use(verifyRole('admin'));

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/suspend', suspendUser);

router.patch('/doctors/:id/verify', verifyDoctor);

router.get('/analytics', getAnalytics);

module.exports = router;
