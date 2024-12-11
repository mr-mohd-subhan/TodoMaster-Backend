import express from 'express'
import { getUser, login, logout, register } from '../controllers/authControllers.js'
import { isAuthenticated } from '../middlewares/checkAuth.js'

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/getuser", isAuthenticated, getUser)
router.get("/logout", isAuthenticated, logout)

export default router