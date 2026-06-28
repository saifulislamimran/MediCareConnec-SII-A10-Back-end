const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// Helper to get doctor profile for the logged in user
const getDoctorProfile = async (userId) => {
  return await Doctor.findOne({ userId });
};

// @desc    Fetch incoming patient appointments
// @route   GET /api/doctor/requests
// @access  Private (Doctor)
exports.getDoctorRequests = async (req, res, next) => {
  try {
    const doctor = await getDoctorProfile(req.user.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

    const requests = await Appointment.find({ doctorId: doctor._id })
      .populate('patientId', 'name email phone gender')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status (Accept, Reject, Completed)
// @route   PATCH /api/doctor/requests/:id
// @access  Private (Doctor)
exports.updateRequestStatus = async (req, res, next) => {
  try {
    const { appointmentStatus } = req.body;
    const doctor = await getDoctorProfile(req.user.id);

    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    // Verify appointment belongs to this doctor
    if (appointment.doctorId.toString() !== doctor._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this appointment' });
    }

    appointment.appointmentStatus = appointmentStatus;
    await appointment.save();

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Manage weekly working hours
// @route   PUT /api/doctor/schedule
// @access  Private (Doctor)
exports.manageSchedule = async (req, res, next) => {
  try {
    const { availableDays, availableSlots } = req.body;
    let doctor = await getDoctorProfile(req.user.id);

    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

    doctor.availableDays = availableDays || doctor.availableDays;
    doctor.availableSlots = availableSlots || doctor.availableSlots;
    await doctor.save();

    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
};
