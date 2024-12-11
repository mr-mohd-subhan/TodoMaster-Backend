import express from 'express'
import { isAuthenticated } from '../middlewares/checkAuth.js'
import { createTask, getMyTasks, removeTask, taskCompleted } from '../controllers/taskControllers.js'
const router = express.Router()

router.post('/createtask', isAuthenticated, createTask)
router.post('/completetask', isAuthenticated, taskCompleted)
router.post('/removetask', isAuthenticated, removeTask)
router.get('/getmytasks', isAuthenticated, getMyTasks)

export default router