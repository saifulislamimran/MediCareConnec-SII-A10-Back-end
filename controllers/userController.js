const User = require('../models/User');

// @desc    Update user profile
// @route   PATCH /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { department, accessLevel, name, phone, address, gender, bloodGroup } = req.body;

    // Common updates
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (gender) user.gender = gender;
    if (bloodGroup) user.bloodGroup = bloodGroup;

    // Doctor specific updates for HR workflows
    if (user.role === 'doctor') {
      if (department || accessLevel) {
        // Init pending updates object if it doesn't exist
        user.roleSpecificData.pendingProfileUpdates = user.roleSpecificData.pendingProfileUpdates || {};

        if (department) user.roleSpecificData.pendingProfileUpdates.department = department;
        if (accessLevel) user.roleSpecificData.pendingProfileUpdates.accessLevel = accessLevel;
      }
    }

    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
