import {
  uploadDocument,
  ragChat,
  deleteDocument,
} from '../services/ragService.js'
import Document from '../models/Document.js'

export const upload = async (req, res) => {
  try {
    const { title, content } = req.body
    const userId = req.user.id

    if (!title || !content) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide title and content' })
    }

    const document = await uploadDocument(userId, title, content)

    res.status(201).json({
      success: true,
      message: 'Document uploaded and embedded successfully',
      document,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const chat = async (req, res) => {
  try {
    const { question } = req.body
    const userId = req.user.id

    if (!question || question.trim() === '') {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide a question' })
    }

    const { answer, context } = await ragChat(userId, question)

    res.status(200).json({
      success: true,
      answer,
      context,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getDocuments = async (req, res) => {
  try {
    const userId = req.user.id

    const documents = await Document.find({ userId }).select(
      'title chunks createdAt'
    )

    res.status(200).json({
      success: true,
      documents,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const removeDocument = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    await deleteDocument(userId, id)

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}