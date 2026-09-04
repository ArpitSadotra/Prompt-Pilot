import { generateEmbedding, chunkText } from './embeddingService.js'
import { getPineconeIndex } from '../config/pinecone.js'
import { generateWithContext } from './aiService.js'
import Document from '../models/Document.js'

export const uploadDocument = async (userId, title, content) => {
  const index = getPineconeIndex()

  const chunks = chunkText(content, 500)
  const vectorIds = []

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    const embedding = await generateEmbedding(chunk)

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
    chunks: chunks.length,
    vectorIds,
  })

  return document
}

export const searchDocuments = async (userId, query, topK = 3) => {
  const index = getPineconeIndex()

  const queryEmbedding = await generateEmbedding(query)

  const results = await index.query({
    vector: queryEmbedding,
    topK,
    filter: {
      userId: userId.toString(),
    },
    includeMetadata: true,
  })

  return results.matches.map((match) => match.metadata.text).join('\n\n')
}

export const deleteDocument = async (userId, documentId) => {
  const document = await Document.findOne({
    _id: documentId,
    userId,
  })

  if (!document) {
    throw new Error('Document not found')
  }

  const index = getPineconeIndex()
  if (document.vectorIds.length > 0) {
    await index.deleteMany(document.vectorIds)
  }

  await Document.findByIdAndDelete(documentId)

  return true
}

export const ragChat = async (userId, question) => {
  const context = await searchDocuments(userId, question)

  if (!context || context.trim() === '') {
    return {
      answer: 'No relevant documents found. Please upload your code first.',
      context: '',
    }
  }

  const answer = await generateWithContext(question, context)

  return { answer, context }
}