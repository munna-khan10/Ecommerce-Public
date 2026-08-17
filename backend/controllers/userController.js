import validator from "validator";
import bcrypt from "bcryptjs";
import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail } from "../config/mailer.js";

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const createVerificationToken = () => crypto.randomBytes(32).toString("hex");
const hashVerificationToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email: String(email || "").toLowerCase().trim() });

        if (!user) return res.status(404).json({ success: false, message: "User does not exist" });

        const isMatch = await bcrypt.compare(password || "", user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Incorrect password" });

        if (!user.emailVerified) {
            return res.status(403).json({
                success: false,
                emailNotVerified: true,
                email: user.email,
                message: "Please verify your email before logging in"
            });
        }

        const token = createToken(user._id);
        return res.json({ success: true, token });
    } catch (error) {
        console.error("loginUser:", error);
        return res.status(500).json({ success: false, message: "Unable to login right now" });
    }
};

const registerUser = async (req, res) => {
    try {
        const name = String(req.body.name || "").trim();
        const email = String(req.body.email || "").toLowerCase().trim();
        const password = String(req.body.password || "");

        if (!name) return res.status(400).json({ success: false, message: "Please enter your name" });
        if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: "Please enter a valid email" });
        if (password.length < 8) return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });

        const exists = await UserModel.findOne({ email });
        if (exists) {
            if (!exists.emailVerified) {
                return res.status(409).json({ success: false, emailNotVerified: true, email, message: "This email is registered but not verified. Please resend the verification email." });
            }
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const rawToken = createVerificationToken();

        const user = await new UserModel({
            name,
            email,
            password: hashedPassword,
            emailVerified: false,
            emailVerificationToken: hashVerificationToken(rawToken),
            emailVerificationExpires: new Date(Date.now() + 30 * 60 * 1000),
        }).save();

        try {
            await sendVerificationEmail({ to: user.email, name: user.name, token: rawToken });
        } catch (mailError) {
            await UserModel.findByIdAndDelete(user._id);
            throw mailError;
        }

        return res.status(201).json({
            success: true,
            requiresVerification: true,
            email: user.email,
            message: "Account created. Please check your email and verify your account."
        });
    } catch (error) {
        console.error("registerUser:", error);
        return res.status(500).json({ success: false, message: error.message || "Unable to register right now" });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const rawToken = String(req.body.token || req.query.token || "");
        if (!rawToken) return res.status(400).json({ success: false, message: "Verification token is required" });

        const hashedToken = hashVerificationToken(rawToken);
        const user = await UserModel.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpires: { $gt: new Date() },
        });

        if (!user) return res.status(400).json({ success: false, message: "Verification link is invalid or expired" });

        user.emailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpires = null;
        await user.save();

        return res.json({ success: true, message: "Email verified successfully. You can now log in." });
    } catch (error) {
        console.error("verifyEmail:", error);
        return res.status(500).json({ success: false, message: "Unable to verify email right now" });
    }
};

const resendVerificationEmail = async (req, res) => {
    try {
        const email = String(req.body.email || "").toLowerCase().trim();
        if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: "Please enter a valid email" });

        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User does not exist" });
        if (user.emailVerified) return res.status(400).json({ success: false, message: "Email is already verified. You can log in." });

        const rawToken = createVerificationToken();
        user.emailVerificationToken = hashVerificationToken(rawToken);
        user.emailVerificationExpires = new Date(Date.now() + 30 * 60 * 1000);
        await user.save();

        await sendVerificationEmail({ to: user.email, name: user.name, token: rawToken });
        return res.json({ success: true, message: "A new verification email has been sent" });
    } catch (error) {
        console.error("resendVerificationEmail:", error);
        return res.status(500).json({ success: false, message: error.message || "Unable to resend verification email" });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });
            return res.json({ success: true, token });
        }
        return res.status(401).json({ success: false, message: "Invalid admin credentials" });
    } catch (error) {
        console.error("loginAdmin:", error);
        return res.status(500).json({ success: false, message: "Unable to login admin" });
    }
};

export { loginUser, registerUser, verifyEmail, resendVerificationEmail, loginAdmin };
