# MediCare Connect API

Enterprise-grade backend API built with Express.js, MongoDB, and JSON Web Tokens.
Powering the MediCare Connect Healthcare Ecosystem.

## 🚀 Technologies Used
- Node.js & Express.js
- MongoDB & Mongoose
- JWT (HttpOnly Cookies) & Bcryptjs
- Stripe Payment Gateway
- Nodemailer

## 🔐 Environment Variables Required
To run this project, you will need to add the following environment variables to your `.env` file:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_EMAIL=your_smtp_username
SMTP_PASSWORD=your_smtp_password
FROM_NAME=MediCare Connect
FROM_EMAIL=noreply@medicareconnect.com
```

## 📜 Deployment (Vercel)
This backend includes a `vercel.json` file configured for `@vercel/node` deployments. Ensure to set the `CLIENT_URL` correctly in production to match your frontend domain to avoid CORS issues.
