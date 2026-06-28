const mongoose = require('mongoose');

const ehrDocumentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a document title']
  },
  category: {
    type: String,
    required: [true, 'Please add a document category (e.g. Lab Report, Prescription, Scan)'],
    enum: ['Lab Report', 'Prescription', 'Medical Scan', 'Vaccine Certificate', 'Other']
  },
  fileUrl: {
    type: String,
    required: [true, 'Please provide the document file URL']
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('EHRDocument', ehrDocumentSchema);
