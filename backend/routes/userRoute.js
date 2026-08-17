import express from 'express';
import { registerUser, loginUser, verifyEmail, resendVerificationEmail, loginAdmin } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/verify-email', verifyEmail);
userRouter.get('/verify-email', verifyEmail);
userRouter.post('/resend-verification', resendVerificationEmail);
userRouter.post('/admin', loginAdmin);

export default userRouter;
