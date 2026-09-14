import axios from 'axios'

export const generateEmbedding = async (text) => {
  try {
    // Clean and limit text
    const cleanText = text.substring(0, 2000).trim()

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${process.env.GEMINI_API_KEY}`,
      {
        model: 'models/text-embedding-004',
        content: {
          role: 'user',
          parts: [{ text: cleanText }],
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    )

    const values = response.data?.embedding?.values

    if (!values || values.length === 0) {
      throw new Error('Empty embedding returned')
    }

    console.log(`✅ Embedding generated: ${values.length} dimensions`)
    return values
  } catch (error) {
    console.error('Embedding error:', error.response?.data || error.message)

    // Try fallback model
    return await generateEmbeddingFallback(text)
  }
}

const generateEmbeddingFallback = async (text) => {
  try {
    console.log('⚠️ Trying embedding fallback model...')

    const cleanText = text.substring(0, 2000).trim()

    // Try embedding-001 as fallback
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${process.env.GEMINI_API_KEY}`,
      {
        model: 'models/embedding-001',
        content: {
          role: 'user',
          parts: [{ text: cleanText }],
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    )

    const values = response.data?.embedding?.values

    if (!values || values.length === 0) {
      throw new Error('Empty fallback embedding returned')
    }

    console.log(`✅ Fallback embedding generated: ${values.length} dimensions`)
    return values
  } catch (error) {
    console.error('Fallback embedding error:', error.response?.data || error.message)
    throw new Error('All embedding models failed')
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