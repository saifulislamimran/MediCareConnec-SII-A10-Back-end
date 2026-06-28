const EHRDocument = require('../models/EHRDocument');
const nodemailer = require('nodemailer');

// @desc    Handle EHR document vault metadata saving
// @route   POST /api/ehr/upload
// @access  Private (Patient/Doctor/Admin)
exports.uploadEHRDocument = async (req, res, next) => {
  try {
    const { patientId, doctorId, documentType, fileUrl, notes } = req.body;

    const document = await EHRDocument.create({
      patientId,
      doctorId,
      documentType,
      fileUrl,
      notes
    });

    res.status(201).json({ success: true, data: document });
  } catch (error) {
    next(error);
  }
};

// @desc    Send email reminders
// @route   POST /api/reminders/send
// @access  Private
exports.sendReminder = async (req, res, next) => {
  try {
    const { email, subject, message } = req.body;

    // Create a Nodemailer transporter using SMTP
    // For production, configure via environment variables (e.g. SendGrid, AWS SES, or Gmail SMTP)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: process.env.SMTP_PORT || 2525,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });

    const messagePayload = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: subject,
      text: message
    };

    await transporter.sendMail(messagePayload);

    res.status(200).json({ success: true, message: 'Reminder email sent' });
  } catch (error) {
    next(error);
  }
};
