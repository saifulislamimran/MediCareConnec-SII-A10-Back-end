const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');

// @desc    Create Stripe payment intent and log payment
// @route   POST /api/payments/create-intent
// @access  Private (Patient/User)
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { appointmentId, amount } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.patientId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized for this appointment payment' });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: 'usd',
      metadata: { appointmentId: appointment._id.toString() }
    });

    // Store payment log
    const payment = await Payment.create({
      appointmentId,
      patientId: req.user.id,
      amount,
      transactionId: paymentIntent.id,
      paymentMethod: 'Stripe',
      paymentStatus: 'Completed' // Simulating completion for this phase
    });

    // Update appointment payment status
    appointment.paymentStatus = 'Paid';
    await appointment.save();

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      data: payment
    });
  } catch (error) {
    next(error);
  }
};
