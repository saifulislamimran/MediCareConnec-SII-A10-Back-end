const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Book an appointment
// @route   POST /api/appointments/book
// @access  Private (Patient/User)
exports.bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, symptoms } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // 🚨 FIX: Verify if the requested slot is actually available
    if (!doctor.availableSlots.includes(appointmentTime)) {
       return res.status(400).json({ success: false, message: 'This slot is no longer available' });
    }

    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      appointmentDate,
      appointmentTime,
      symptoms,
      appointmentStatus: 'Pending',
      paymentStatus: 'Pending'
    });

    // 🚨 FIX: Remove the booked slot from the Doctor's availability
    doctor.availableSlots = doctor.availableSlots.filter(slot => slot !== appointmentTime);
    await doctor.save();

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch patient's appointment history
// @route   GET /api/appointments/my-list
// @access  Private (Patient/User)
exports.getMyAppointmentList = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id })
      .populate('doctorId', 'doctorName specialization consultationFee')
      .sort('-appointmentDate');

    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    next(error);
  }
};

// @desc    Reschedule appointment
// @route   PATCH /api/appointments/:id/reschedule
// @access  Private (Patient/User)
exports.rescheduleAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Make sure user is appointment owner
    if (appointment.patientId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to reschedule this appointment' });
    }

    appointment.appointmentDate = req.body.appointmentDate || appointment.appointmentDate;
    appointment.appointmentTime = req.body.appointmentTime || appointment.appointmentTime;
    appointment.appointmentStatus = 'Pending'; // Rescheduling sets it back to pending
    await appointment.save();

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private (Patient/User)
exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.patientId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this appointment' });
    }

    await appointment.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
