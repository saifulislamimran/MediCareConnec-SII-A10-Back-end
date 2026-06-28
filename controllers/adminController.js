const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Payment = require('../models/Payment');

// @desc    View all system users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    // Cleanup doctor profile if exists
    if (user.role === 'doctor') {
      await Doctor.findOneAndDelete({ userId: req.params.id });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Suspend user
// @route   PATCH /api/admin/users/:id/suspend
// @access  Private (Admin)
exports.suspendUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.status = user.status === 'Active' ? 'Suspended' : 'Active';
    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle doctor verification status
// @route   PATCH /api/admin/doctors/:id/verify
// @access  Private (Admin)
exports.verifyDoctor = async (req, res, next) => {
  try {
    const { verificationStatus } = req.body; // Verify / Rejected / Pending
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    doctor.verificationStatus = verificationStatus;
    await doctor.save();

    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
};

// @desc    Get advanced admin analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
exports.getAnalytics = async (req, res, next) => {
  try {
    // Pipeline 1: Doctor Performance ratings
    const doctorPerformance = await Doctor.aggregate([
      { $match: { verificationStatus: 'Verified' } },
      { $project: { name: '$doctorName', rating: '$averageRating', reviews: '$totalReviews' } },
      { $sort: { rating: -1 } },
      { $limit: 10 }
    ]);

    // Pipeline 2: Financial revenue growth (Total payments grouped by month)
    const revenueGrowth = await Payment.aggregate([
      { $match: { paymentStatus: 'Completed' } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalRevenue: { $sum: '$amount' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Pipeline 3: Monthly appointment volume
    const appointmentVolume = await Appointment.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        doctorPerformance,
        revenueGrowth,
        appointmentVolume
      }
    });
  } catch (error) {
    next(error);
  }
};
