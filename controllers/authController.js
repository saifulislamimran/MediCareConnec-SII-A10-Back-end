const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secure_medicare_secret_key_12345', {
    expiresIn: '7d'
  });
};

// Helper to set Cookie
const sendTokenCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  };
  res.cookie('token', token, cookieOptions);
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const { name, email, password, role, phone } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Registration failed. Email is already registered.'
      });
    }

    // Password validation: min 6 chars, 1 number, 1 special char
    const minLength = password.length >= 6;
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>_+\-\[\]\\\/]/.test(password);

    if (!minLength || !hasNumber || !hasSpecial) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters and contain at least one number and one special character.'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'patient',
      phone: phone || ''
    });

    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check user in DB
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Account not found.'
      });
    }

    // Check password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.'
      });
    }

    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Google OAuth Register/Login simulation
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res, next) => {
  const { name, email, googleId, avatar } = req.body;

  try {
    if (!email || !googleId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and googleId'
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user for google signup
      user = await User.create({
        name,
        email,
        googleId,
        avatar: avatar || '',
        role: 'patient'
      });
    } else {
      // Connect googleId if not connected yet
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    }

    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
exports.logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (error) {
    next(error);
  }
};
