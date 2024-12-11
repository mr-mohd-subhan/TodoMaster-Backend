import express from 'express'
import { isAuthenticated } from '../middlewares/checkAuth.js'
import { contact, support } from '../controllers/generalControllers.js'

const router = express.Router()

router.post("/contact", contact)
router.post("/support", isAuthenticated, support)

export default router
