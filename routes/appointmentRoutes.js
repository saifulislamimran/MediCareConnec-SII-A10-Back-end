const express = require('express');
const {
  bookAppointment,
  getMyAppointmentList,
  rescheduleAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);
router.use(verifyRole('patient', 'user'));

router.post('/book', bookAppointment);
router.get('/my-list', getMyAppointmentList);
router.route('/:id/reschedule').patch(rescheduleAppointment);
router.route('/:id').delete(deleteAppointment);

module.exports = router;
