import contactModel from "../models/contactModel.js"
import supportModel from "../models/supportModel.js"
import winston from 'winston'

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

export const contact = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        await contactModel.create({ name, email, message });
        return res.status(200).json({ success: true });
    } catch (error) {
        if (error.name === "ValidationError") {
            const errorMessage = Object.values(error.errors)
                .map(err => err.message)
                .join(", ");
            return res.status(400).json({ success: false, message: errorMessage });
        }
        logger.error(`Contact form error: ${error.message}`, { error });

        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const support = async (req, res) => {
    try {
        const { category, complain } = req.body;

        if (!category || !complain) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        await supportModel.create({ user: req.userId, category, complain });
        return res.status(200).json({ success: true });
    } catch (error) {
        if (error.name === "ValidationError") {
            const errorMessage = Object.values(error.errors)
                .map(err => err.message)
                .join(", ");
            return res.status(400).json({ success: false, message: errorMessage });
        }

        logger.error(`Support form error: ${error.message}`, { error });
        return res.status(500).json({ success: false, message: "An unexpected error occurred. Please try again later." });
    }
};

