const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');

// @desc    Get platform statistics
// @route   GET /api/stats/platform
// @access  Public
exports.getPlatformStats = async (req, res, next) => {
  try {
    const totalDoctors = await Doctor.countDocuments({ verificationStatus: 'Verified' });
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalAppointments = await Appointment.countDocuments();
    const totalReviews = await Review.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalDoctors,
        totalPatients,
        totalAppointments,
        totalReviews
      }
    });
  } catch (error) {
    next(error);
  }
};
