import mongoose from "mongoose";

const supportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['dataLost', 'poorInterface', 'bugs', 'other']
    },
    complain: {
        type: String,
        required: true,
        minLength: [20, "Complain should be atleast 20 characters long!"],
        maxLength: [200, "Complain cannot exceed 200 characters"]
    }
}, {
    timestamps: true
})

const supportModel = mongoose.model('complain', supportSchema)
export default supportModel