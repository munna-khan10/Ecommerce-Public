# Ecommerce App Setup

## 1. Backend
cd backend
npm install
copy .env.example .env
# Fill MongoDB, JWT, Cloudinary and admin credentials
npm run server

## 2. Frontend
cd frontend
npm install
copy .env.example .env
npm run dev

## 3. Admin
cd admin
npm install
copy .env.example .env
npm run dev

## Environment
Do not commit real `.env` files. The backend requires:
- MONGODB_URL
- JWT_SECRET
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- ADMIN_EMAIL
- ADMIN_PASSWORD
- FRONTEND_URL
- ADMIN_URL

Frontend/admin require VITE_BACKEND_URL.

## Payment
COD is immediately recorded as unpaid COD.
bKash/Rocket orders are recorded as `pending` and require admin payment verification.
This project does not claim transaction IDs are automatically verified with bKash/Rocket. Official gateway/API verification must be configured before production use.


## Email verification

Add these variables to `backend/.env` (Gmail example):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
MAIL_FROM=your-email@gmail.com
FRONTEND_URL=http://localhost:5174
ADMIN_URL=http://localhost:5173
```

For Gmail, enable 2-Step Verification and create a Google App Password. Do not use your normal Gmail password.

New users receive a verification email. The verification token expires after 30 minutes. Unverified users cannot log in, and the login page provides a resend-verification option.
