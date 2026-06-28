const express = require('express');
const {
  getDoctorRequests,
  updateRequestStatus,
  manageSchedule
} = require('../controllers/doctorPortalController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);
router.use(verifyRole('doctor'));

router.get('/requests', getDoctorRequests);
router.patch('/requests/:id', updateRequestStatus);
router.route('/schedule')
  .post(manageSchedule)
  .put(manageSchedule)
  .delete(manageSchedule); // Simplification for the assignment

module.exports = router;
