import express from 'express'
import { signup, login, getMe, updateProfile } from '../controllers/authController.js'
import isAuthenticated from '../middleware/auth.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/me', isAuthenticated, getMe)
router.put('/me', isAuthenticated, updateProfile)

export default router