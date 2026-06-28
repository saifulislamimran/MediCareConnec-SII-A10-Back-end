const Prescription = require('../models/Prescription');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// Helper to get doctor profile
const getDoctorProfile = async (userId) => {
  return await Doctor.findOne({ userId });
};

// @desc    Issue a prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor)
exports.issuePrescription = async (req, res, next) => {
  try {
    const { appointmentId, patientId, diagnosis, medications, instructions } = req.body;
    const doctor = await getDoctorProfile(req.user.id);

    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

    // Validate appointment exists and belongs to the doctor
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || appointment.doctorId.toString() !== doctor._id.toString()) {
      return res.status(401).json({ success: false, message: 'Invalid appointment or not authorized' });
    }

    const prescription = await Prescription.create({
      appointmentId,
      patientId,
      doctorId: doctor._id,
      diagnosis,
      medications,
      instructions
    });

    // Mark appointment as completed since prescription is given
    appointment.appointmentStatus = 'Completed';
    await appointment.save();

    res.status(201).json({ success: true, data: prescription });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a prescription
// @route   PUT /api/prescriptions/:id
// @access  Private (Doctor)
exports.updatePrescription = async (req, res, next) => {
  try {
    let prescription = await Prescription.findById(req.params.id);
    if (!prescription) return res.status(404).json({ success: false, message: 'Prescription not found' });

    const doctor = await getDoctorProfile(req.user.id);
    if (!doctor || prescription.doctorId.toString() !== doctor._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this prescription' });
    }

    prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: prescription });
  } catch (error) {
    next(error);
  }
};
