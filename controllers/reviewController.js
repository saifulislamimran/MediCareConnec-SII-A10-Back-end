const Review = require('../models/Review');
const Doctor = require('../models/Doctor');

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private (Patient/User)
exports.createReview = async (req, res, next) => {
  try {
    const { doctorId, rating, reviewText } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const review = await Review.create({
      patientId: req.user.id,
      doctorId,
      rating,
      reviewText
    });

    // Update Doctor's average rating and total reviews
    const reviews = await Review.find({ doctorId });
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / totalReviews;

    doctor.averageRating = averageRating;
    doctor.totalReviews = totalReviews;
    await doctor.save();

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private (Patient/User)
exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.patientId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this review' });
    }

    review.rating = req.body.rating || review.rating;
    review.reviewText = req.body.reviewText || review.reviewText;
    await review.save();

    // Update doctor average rating
    const doctor = await Doctor.findById(review.doctorId);
    const reviews = await Review.find({ doctorId: doctor._id });
    doctor.averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    await doctor.save();

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Patient/User)
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.patientId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this review' });
    }

    const doctorId = review.doctorId;
    await review.deleteOne();

    // Update doctor average rating
    const doctor = await Doctor.findById(doctorId);
    const reviews = await Review.find({ doctorId });
    if (reviews.length === 0) {
      doctor.averageRating = 0;
      doctor.totalReviews = 0;
    } else {
      doctor.averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
      doctor.totalReviews = reviews.length;
    }
    await doctor.save();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
