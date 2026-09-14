import { generateEmbedding, chunkText } from './embeddingService.js'
import { getPineconeIndex } from '../config/pinecone.js'
import { generateWithContext } from './aiService.js'
import Document from '../models/Document.js'

export const uploadDocument = async (userId, title, content) => {
  try {
    const index = getPineconeIndex()
    const chunks = chunkText(content, 500)

    if (chunks.length === 0) {
      throw new Error('No content to embed')
    }

    const vectorIds = []

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      if (!chunk || chunk.trim().length < 10) continue

      const embedding = await generateEmbedding(chunk)

      console.log(`Chunk ${i} embedding dimensions: ${embedding.length}`)

      const vectorId = `${userId}_${Date.now()}_${i}`
      vectorIds.push(vectorId)

      await index.upsert([
        {
          id: vectorId,
          values: embedding,
          metadata: {
            text: chunk,
            userId: userId.toString(),
            title,
            chunkIndex: i,
          },
        },
      ])
    }

    const document = await Document.create({
      userId,
      title,
      content,
      chunks: vectorIds.length,
      vectorIds,
    })

    return document
  } catch (error) {
    console.error('Upload error:', error.message)
    throw error
  }
}

export const searchDocuments = async (userId, query, topK = 3) => {
  try {
    const index = getPineconeIndex()
    const queryEmbedding = await generateEmbedding(query)

    const results = await index.query({
      vector: queryEmbedding,
      topK,
      filter: {
        userId: { $eq: userId.toString() },
      },
      includeMetadata: true,
    })

    if (!results.matches || results.matches.length === 0) {
      return ''
    }

    return results.matches
      .filter((match) => match.metadata?.text)
      .map((match) => match.metadata.text)
      .join('\n\n')
  } catch (error) {
    console.error('Search error:', error.message)
    throw error
  }
}

export const deleteDocument = async (userId, documentId) => {
  try {
    const document = await Document.findOne({ _id: documentId, userId })

    if (!document) {
      throw new Error('Document not found')
    }

    const index = getPineconeIndex()

    if (document.vectorIds && document.vectorIds.length > 0) {
      await index.deleteMany(document.vectorIds)
    }

    await Document.findByIdAndDelete(documentId)
    return true
  } catch (error) {
    console.error('Delete error:', error.message)
    throw error
  }
}

export const ragChat = async (userId, question) => {
  try {
    const context = await searchDocuments(userId, question)

    if (!context || context.trim() === '') {
      return {
        answer: 'No relevant code found. Please upload your code files first.',
        context: '',
      }
    }

    const answer = await generateWithContext(question, context)
    return { answer, context }
  } catch (error) {
    console.error('RAG chat error:', error.message)
    throw error
  }
}