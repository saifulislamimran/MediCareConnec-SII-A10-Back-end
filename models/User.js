const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: function() { return !this.googleId; },
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'doctor', 'patient', 'user'],
    default: 'patient'
  },
  photo: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', ''],
    default: ''
  },
  bloodGroup: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'Blocked', 'Pending'],
    default: 'Active'
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Advanced Medical Info
  dob: {
    type: String,
    default: ''
  },

  // Enterprise RBAC Extension
  roleSpecificData: {
    department: { type: String, default: '' },
    qualifications: { type: String, default: '' },
    accessLevel: { type: String, default: 'Level 1 (Standard Operations)' }
  },

  // HR Approval / Admin Approval pending updates
  pendingProfileUpdates: {
    department: { type: String, default: '' },
    qualifications: { type: String, default: '' },
    accessLevel: { type: String, default: '' },
    isPending: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
