const Doctor = require('../models/Doctor');

// @desc    Get all doctors (with advanced search, sorting, and pagination)
// @route   GET /api/doctors
// @access  Public
exports.getDoctors = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude from matching
    const removeFields = ['search', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query object
    let queryStr = JSON.stringify(reqQuery);

    // Advanced filtering (e.g. gt, gte, lt, lte) if needed
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Parse back to JSON
    let parsedQuery = JSON.parse(queryStr);

    // Only show verified doctors to public by default unless specified
    if (!parsedQuery.verificationStatus) {
      parsedQuery.verificationStatus = 'Verified';
    }

    // Challenge 1: Advanced Search (Regex)
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      parsedQuery = {
        ...parsedQuery,
        $or: [
          { doctorName: searchRegex },
          { specialization: searchRegex }
        ]
      };
    }

    query = Doctor.find(parsedQuery).populate({
      path: 'userId',
      select: 'name email photo role phone gender bloodGroup address'
    });

    // Challenge 2: Dynamic Sorting
    if (req.query.sort) {
      // Sort can be e.g. "consultationFee,-experience,-averageRating"
      const sortBy = req.query.sort.split(',').join(' ');
      // Replace generic rating with averageRating field
      const actualSortBy = sortBy.replace(/\brating\b/g, 'averageRating');
      query = query.sort(actualSortBy);
    } else {
      query = query.sort('-createdAt'); // Default sort
    }

    // Challenge 4: Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Doctor.countDocuments(parsedQuery);

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const doctors = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: doctors.length,
      pagination,
      total,
      data: doctors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single doctor profile
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate({
      path: 'userId',
      select: 'name email photo role phone gender bloodGroup address'
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};
