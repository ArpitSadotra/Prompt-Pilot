import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import initPinecone from './config/pinecone.js'
import errorHandler from './middleware/errorHandler.js'

import authRoutes from './routes/authRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import agentRoutes from './routes/agentRoutes.js'
import ragRoutes from './routes/ragRoutes.js'

dotenv.config()

const app = express()

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Connect databases
connectDB()
initPinecone()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/agent', agentRoutes)
app.use('/api/rag', ragRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server running' })
})

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`)
  console.log(`📝 Environment: ${process.env.NODE_ENV}`)
})