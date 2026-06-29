const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Doctor = require('../models/Doctor');

router.get('/doctors', async (req, res) => {
  try {
    // 1. Check if we already have seeded doctors
    const existingDoctors = await Doctor.find();
    if (existingDoctors.length > 0) {
      return res.status(200).json({
        message: 'Doctors are already seeded in the database',
        count: existingDoctors.length,
      });
    }

    const mockData = [
      {
        name: 'Dr. Sarah Jenkins',
        email: 'sarah.jenkins@medicare.com',
        specialization: 'Neurology',
        qualifications: 'MBBS, MD, DM',
        experience: 12,
        consultationFee: 150,
        hospitalName: 'Central Medical Institute',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnVLhcLOOtJ-rR4YQprPmEJY-dCp730A_i5-JpLhJCzj5qlRNJ6mfakWFDNSMc-50vb0l_4knUKV13UTuX5nl24abrAJ4EjHHEQZPvFfRBKEEnXzYBTIVQp2rZruHtiGS0GyGCVrB0ahKhErUIT4qjvjlfyafWcuCqViwq7-EBY5ozfKtrO2hqYCh3uPA38qjiRVv11hdEYmdoY74L2TS6TUPfH8PRBLFh7NGT0bzItdEabwQTq3BP9tqa-YDUSOoMMW2WigdNxAJN',
        rating: 4.9
      },
      {
        name: 'Dr. Michael Chen',
        email: 'michael.chen@medicare.com',
        specialization: 'Cardiology',
        qualifications: 'MBBS, MD, FACC',
        experience: 15,
        consultationFee: 130,
        hospitalName: 'Heart & Vascular Center',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqG3h6ozuy90NlkehoL5izF83uoB2kI2QBgcubcRcYYWECEe2dXvZRUk5WnU7wDtXUBOHNX6Ql5QmbdHtxwlbrZ-HnbJDXwCZHyAH-YkqmsHbLybmWdZxRQdtl9N068LxQGVzRvBchq5dSyFvMKNMwoArzuYSn54WvvloHPxhh2Miiq0nKsK-SxZJlRau2e57VixcPywuAfP_Xyv7Yj2tq4builHBEnAO02DmleM3yLqipGRCMH3HTSP3EwBin5ZBALQngF-GRBsxj',
        rating: 4.8
      },
      {
        name: 'Dr. Elena Rodriguez',
        email: 'elena.rodriguez@medicare.com',
        specialization: 'Pediatrics',
        qualifications: 'MBBS, DCH',
        experience: 8,
        consultationFee: 95,
        hospitalName: "Valley Children's Hospital",
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjJYWo5gZYzOPY5oVRUPZ83kSjCupVP6FFr7gm90DkASjDCm4K5LXct7opNRakmH_PywJdJfKlcd6VPOI5YiSx922ZsC6DLqAjce8Tiozyh7raomBe8Brz2De88h5JI5Ns3WCBPQ-yuarL1c_enWxdJzcCRdpQukcNZKOzivx6-kgV-LlDYUFvSSHJcA1sEvwGFgloWr94ryVFhgmEDWRARGRfSiGZLmw8tkbzZs6GZ0jC0lvjhqYnWGNodMVaZr6jmYvC5vflhd_E',
        rating: 5.0
      },
      {
        name: 'Dr. James Wilson',
        email: 'james.wilson@medicare.com',
        specialization: 'Dermatology',
        qualifications: 'MBBS, MD',
        experience: 20,
        consultationFee: 150,
        hospitalName: 'Skin & Laser Clinic',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaKU6Nab3yqbEWHPLSGbGE7mLYB6hY-aqQJbhnhqAsuENsjS5MCTEZfLTwjEmvX1lxhgXXN9Oj8lDvLIB20ecalUB7SYDbIot3JJJ88S2UIjjWIIU42ocFmdxh3_8fPBUt5tVYXqqk8WkZARzfwekXtOpcJKjQwiI428snE-E8W9dP2A50txpiBmss82l0lQcYeJNflW8nwtMdVyYLLZWGk2Z4YmdxonE4ZpVyPnLQ2hdlvyknIJVEPiYHO-xUC3No9RSCYk1TUWFT',
        rating: 4.7
      },
      {
        name: 'Dr. Sarah Chen',
        email: 'sarah.chen@medicare.com',
        specialization: 'Cardiology',
        qualifications: 'MBBS, MD, FRCP',
        experience: 10,
        consultationFee: 120,
        hospitalName: 'Central Medical Institute',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPfR7siv-cFegYXw7KFNTdViFLMoQRF8KOTKcNOX17dibHCtmG4QJk9lkP924VML0USpY7CE6fy7A2M79NIA6GzcDX2s2KUcntAJ3K5LRz3Y020PKsXvmMILtrk3uFGFY0cXCCOvgf0H3GQKIbiYrKgkG1IwHXmSCaOq8QVtSdyyCTgKGZYsfobwSa6wdmVRG1o-sO09_9bcdX5b8-E7KYiOoc_EdBuyjUdmEU0-f5vibehRhTssieVYuPgMr41351unaPoWRgk4jK',
        rating: 4.9
      },
      {
        name: 'Dr. Marcus Thorne',
        email: 'marcus.thorne@medicare.com',
        specialization: 'Orthopedics',
        qualifications: 'MS, MCh (Orth)',
        experience: 14,
        consultationFee: 180,
        hospitalName: 'Surgical Center',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjJYWo5gZYzOPY5oVRUPZ83kSjCupVP6FFr7gm90DkASjDCm4K5LXct7opNRakmH_PywJdJfKlcd6VPOI5YiSx922ZsC6DLqAjce8Tiozyh7raomBe8Brz2De88h5JI5Ns3WCBPQ-yuarL1c_enWxdJzcCRdpQukcNZKOzivx6-kgV-LlDYUFvSSHJcA1sEvwGFgloWr94ryVFhgmEDWRARGRfSiGZLmw8tkbzZs6GZ0jC0lvjhqYnWGNodMVaZr6jmYvC5vflhd_E',
        rating: 4.7
      }
    ];

    const createdDoctors = [];

    // 2. Loop through and create User + Doctor records
    for (let data of mockData) {
      // Create User (Auth Layer)
      const user = await User.create({
        name: data.name,
        email: data.email,
        password: 'password123',
        role: 'doctor',
        photo: data.image
      });

      // Create Doctor Profile
      const doctor = await Doctor.create({
        doctorName: data.name,
        userId: user._id,
        specialization: data.specialization,
        qualifications: data.qualifications,
        experience: data.experience,
        consultationFee: data.consultationFee,
        hospitalName: data.hospitalName,
        profileImage: data.image,
        verificationStatus: 'Verified',
        averageRating: data.rating,
        totalReviews: 120,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableSlots: ['10:00 AM', '02:00 PM', '04:00 PM']
      });

      createdDoctors.push(doctor);
    }

    res.status(201).json({
      success: true,
      message: 'Successfully seeded professional doctors',
      count: createdDoctors.length,
      data: createdDoctors
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
