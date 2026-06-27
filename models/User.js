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
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient'
  },
  phone: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
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
  bloodGroup: {
    type: String,
    default: ''
  },
  emergencyContactName: {
    type: String,
    default: ''
  },
  emergencyContactPhone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },

  // Role-Specific Attributes
  department: {
    type: String,
    default: ''
  },
  qualifications: {
    type: String,
    default: ''
  },
  accessLevel: {
    type: String,
    default: ''
  },

  // Pending details (Doctor approval flow)
  pendingDepartment: {
    type: String,
    default: ''
  },
  pendingQualifications: {
    type: String,
    default: ''
  },
  pendingAccessLevel: {
    type: String,
    default: ''
  },
  isDepartmentPending: {
    type: Boolean,
    default: false
  },
  isQualificationsPending: {
    type: Boolean,
    default: false
  },
  isAccessLevelPending: {
    type: Boolean,
    default: false
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
