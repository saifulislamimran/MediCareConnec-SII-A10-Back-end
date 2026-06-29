const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  let token;

  // ১. কুকি থেকে টোকেন চেক করুন (HTTP-Only Cookie)
  if (req.cookies?.token) {
    token = req.cookies.token;
  } 
  // ২. অথরাইজেশন হেডার থেকে টোকেন চেক করুন (Fallback)
  else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.'
    });
  }

  try {
    // JWT ভেরিফিকেশন
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secure_medicare_secret_key_12345');
    
    // ডাটাবেস থেকে ইউজার খোঁজা (পাসওয়ার্ড ফিল্ডটি বাদ দিন সিকিউরিটির জন্য)
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed. User account not found.'
      });
    }

    // ইউজারের ডেটা রিকোয়েস্ট অবজেক্টে সেট করা
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Invalid or expired token.'
    });
  }
};

// রোল-বেসড রেস্ট্রিকশন
const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user নিশ্চিত করা
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // রোল চেক করা
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden. You do not have permission for this role. Authorized: [${allowedRoles.join(', ')}]`
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  verifyRole
};