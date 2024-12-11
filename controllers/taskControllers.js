import taskModel from "../models/taskModel.js";
import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

export const createTask = async (req, res) => {
    try {
        const { title, task, date } = req.body;

        if (!title || !task || !date) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        await taskModel.create({ user: req.userId, title, task, date });
        logger.info(`Task created successfully by user ${req.userId}`, { title, task, date });

        return res.status(200).json({ success: true, message: "Task created successfully!" });
    } catch (error) {
        if (error.name === "ValidationError") {
            const errorMessage = Object.values(error.errors)
                .map(err => err.message)
                .join(", ");
            return res.status(400).json({ success: false, message: errorMessage });
        }
        logger.error(`Error creating task by user ${req.userId}: ${error.message}`, { error });
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const taskCompleted = async (req, res) => {
    try {
        const { taskId } = req.body;
        const task = await taskModel.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.status = task.status === 'Completed' ? 'Incomplete' : 'Completed';
        await task.save();

        logger.info(`Task ${taskId} marked as ${task.status} by user ${req.userId}`);
        res.status(200).json({ message: `Task marked as ${task.status}` });
    } catch (error) {
        logger.error(`Error marking task as completed/incomplete: ${error.message}`, { taskId: req.body.taskId, error });
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const removeTask = async (req, res) => {
    try {
        const { taskId } = req.body;

        if (!taskId) {
            return res.status(400).json({ success: false, message: 'Task id required' });
        }

        await taskModel.findOneAndDelete({ _id: taskId });

        logger.info(`Task ${taskId} removed by user ${req.userId}`);

        return res.status(200).json({ success: true, message: 'Task deleted!' });
    } catch (error) {
        logger.error(`Error removing task ${req.body.taskId} by user ${req.userId}: ${error.message}`, { error });
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const getMyTasks = async (req, res) => {
    try {
        const tasks = await taskModel.find({ user: req.userId });

        logger.info(`Fetched tasks for user ${req.userId}`);

        return res.status(200).json({ success: true, tasks });
    } catch (error) {
        logger.error(`Error fetching tasks for user ${req.userId}: ${error.message}`, { error });

        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
