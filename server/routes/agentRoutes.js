import express from 'express'
import { runAgent } from '../controllers/agentController.js'
import isAuthenticated from '../middleware/auth.js'

const router = express.Router()

router.post('/run', isAuthenticated, runAgent)

export default router