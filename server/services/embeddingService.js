import axios from 'axios'

export const generateEmbedding = async (text) => {
  const cleanText = text.substring(0, 2000).trim()

  try {
    console.log('Generating embedding with gemini-embedding-2...')

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${process.env.GEMINI_API_KEY}`,
      {
        content: {
          parts: [{ text: cleanText }],
        },
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
      }
    )

    const values = response.data?.embedding?.values

    if (values && values.length > 0) {
      console.log(`✅ Embedding generated: ${values.length} dimensions`)
      return values
    }

    throw new Error('Empty embedding returned')
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