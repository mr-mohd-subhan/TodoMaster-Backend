import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
        new winston.transports.File({ filename: 'logs/app.log' }),
    ],
});

export const register = async (req, res) => {
    try {
        const { name, email, password, gender, phone, address } = req.body;

        if (!name || !email || !password || !gender || !phone || !address) {
            logger.warn("Registration failed: Missing required fields", { name, email });
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            logger.warn("Registration failed: Email already in use", { email });
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        if (password.length < 8) {
            logger.warn("Registration failed: Password too short", { email });
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({ name, email, password: hashedPassword, gender, phone, address });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
        });

        logger.info("Registration successful for user", { email, userId: user._id });
        return res.status(200).json({ success: true, user, message: "Registration successful!" });
    } catch (error) {
        if (error.name === "ValidationError") {
            const errorMessage = Object.values(error.errors)
                .map(err => err.message)
                .join(", ");
            return res.status(400).json({ success: false, message: errorMessage });
        }
        logger.error("Registration error:", { error: error.message });
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            logger.warn("Login failed: Missing required fields", { email });
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            logger.warn("Login failed: Invalid credentials", { email });
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            logger.warn("Login failed: Invalid credentials", { email });
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
        });

        logger.info("User logged in successfully", { email, userId: user._id });
        return res.status(200).json({ success: true, message: "Logged in successfully!" });
    } catch (error) {
        logger.error("Login error:", { error: error.message });
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);

        if (!user) {
            logger.warn("User not found", { userId: req.userId });
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, user });
    } catch (error) {
        logger.error("Error fetching user:", { error: error.message, userId: req.userId });
        return res.status(500).json({ success: false, message: `Internal server error` });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
        });
        logger.info("User logged out successfully", { userId: req.userId });
        return res.status(200).json({ success: true, message: "Logged out successfully!" });
    } catch (error) {
        logger.error("Logout error:", { error: error.message });
        return res.status(500).json({ success: false, message: "Failed to log out!" });
    }
};
