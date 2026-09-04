import express from 'express'
import { upload, chat, getDocuments, removeDocument } from '../controllers/ragController.js'
import isAuthenticated from '../middleware/auth.js'

const router = express.Router()

router.post('/upload', isAuthenticated, upload)
router.post('/chat', isAuthenticated, chat)
router.get('/documents', isAuthenticated, getDocuments)
router.delete('/document/:id', isAuthenticated, removeDocument)

export default router