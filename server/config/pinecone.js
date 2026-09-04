import { Pinecone } from '@pinecone-database/pinecone'

let pineconeIndex = null

export const initPinecone = async () => {
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    })

    pineconeIndex = pinecone.index(process.env.PINECONE_INDEX_NAME)
    console.log('✅ Pinecone Connected')
    return pineconeIndex
  } catch (error) {
    console.error('❌ Pinecone Error:', error.message)
    process.exit(1)
  }
}

export const getPineconeIndex = () => {
  if (!pineconeIndex) {
    throw new Error('Pinecone not initialized')
  }
  return pineconeIndex
}

export default initPinecone