import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, "Name should be atleast 3 characters long!"],
        maxLength: [30, "Name cannot exceed 30 characters!"],
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        minLength: [20, "Message should be atleast 20 characters long!"],
        maxLength: [200, "Message cannot exceed 200 characters"],
        required: true
    }
}, { timestamps: true })

const contactModel = mongoose.model("contact", contactSchema)
export default contactModel