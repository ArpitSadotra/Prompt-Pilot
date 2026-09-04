import axios from 'axios'

const EMBEDDING_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent`;

export const generateEmbedding = async (text) => {
  try {
    const response = await axios.post(
      `${EMBEDDING_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        model: 'models/gemini-embedding-001',
        content: {
          parts: [{ text }],
        },
        outputDimensionality: 768,
      }
    )

    return response.data.embedding.values
  } catch (error) {
    console.error('Embedding error:', error.response?.data || error.message)
    throw new Error('Failed to generate embedding')
  }
}

export const chunkText = (text, chunkSize = 500) => {
  const chunks = []
  const sentences = text.split(/[.\n]+/).filter((s) => s.trim().length > 0)

  let currentChunk = ''

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > chunkSize && currentChunk) {
      chunks.push(currentChunk.trim())
      currentChunk = sentence
    } else {
      currentChunk += ' ' + sentence
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim())
  }

  return chunks.length > 0 ? chunks : [text]
}