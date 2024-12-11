import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [3, "Name should ateast 3 characters long!"],
        maxLength: [30, "Name cannot exceed 30 characters"]
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "other"]
    }
}, { timestamps: true })

const userModel = mongoose.model("user", userSchema)
export default userModel