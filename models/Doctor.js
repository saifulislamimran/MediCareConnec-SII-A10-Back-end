const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  doctorName: {
    type: String,
    required: [true, 'Please add the doctor name']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String,
    required: [true, 'Please add a specialization']
  },
  qualifications: {
    type: String,
    required: [true, 'Please add qualifications']
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience']
  },
  consultationFee: {
    type: Number,
    required: [true, 'Please add a consultation fee']
  },
  hospitalName: {
    type: String,
    required: [true, 'Please add the hospital name']
  },
  profileImage: {
    type: String,
    default: ''
  },
  availableDays: {
    type: [String],
    default: []
  },
  availableSlots: {
    type: [String],
    default: []
  },
  verificationStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending'
  },
  averageRating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
