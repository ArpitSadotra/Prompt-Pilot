import axios from 'axios'

const EMBEDDING_URL = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent`

export const generateEmbedding = async (text) => {
  try {
    const response = await axios.post(
      `${EMBEDDING_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        model: 'models/text-embedding-004',
        content: {
          parts: [{ text: text.substring(0, 2000) }],
        },
      }
    )

    const values = response.data?.embedding?.values

    if (!values || values.length === 0) {
      throw new Error('No embedding returned')
    }

    return values
  } catch (error) {
    console.error('Embedding error:', error.response?.data || error.message)
    throw new Error('Failed to generate embedding')
  }
}

export const chunkText = (text, chunkSize = 500) => {
  if (!text || text.trim().length === 0) return []

  const chunks = []
  const lines = text.split('\n')
  let currentChunk = ''

  for (const line of lines) {
    if ((currentChunk + '\n' + line).length > chunkSize && currentChunk) {
      chunks.push(currentChunk.trim())
      currentChunk = line
    } else {
      currentChunk += '\n' + line
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim())
  }

  return chunks.length > 0 ? chunks : [text]
}