import express from 'express'
import { generate, explain } from '../controllers/aiController.js'
import isAuthenticated from '../middleware/auth.js'

const router = express.Router()

router.post('/generate', isAuthenticated, generate)
router.post('/explain', isAuthenticated, explain)

export default router