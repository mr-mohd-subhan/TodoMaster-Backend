import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        title: {
            type: String,
            required: true,
            minLength: [3, 'Title must be at least 3 characters long!'],
            maxLength: [30, 'Title cannot exceed 30 characters!'],
        },
        task: {
            type: String,
            required: true,
            minLength: [20, 'Description must be at least 20 characters long!'],
            maxLength: [300, 'Description cannot exceed 300 characters!'],
        },
        date: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Completed', 'Incomplete'],
            default: 'Incomplete'
        },
    },
    {
        timestamps: true,
    }
);

const taskModel = mongoose.model('task', taskSchema);

export default taskModel;
