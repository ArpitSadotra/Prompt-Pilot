import axios from 'axios'

const callNemotron = async (prompt, useReasoning = false) => {
  try {
    const messages = [
      {
        role: 'user',
        content: prompt,
      },
    ]

    const requestBody = {
      model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
      messages,
      max_tokens: 8192,
      temperature: 0.7,
    }


    if (useReasoning) {
      requestBody.reasoning = { include_reasoning: true }
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'PromptPilot',
        },
      }
    )

    const content = response.data?.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('No response from Nemotron')
    }

    return content
  } catch (error) {
    console.error(
      'Nemotron error:',
      error.response?.data || error.message
    )
    throw new Error(
      error.response?.data?.error?.message || 'AI request failed'
    )
  }
}


export const callGeminiEmbedding = async (text) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${process.env.GEMINI_API_KEY}`,
      {
        model: 'models/text-embedding-004',
        content: { parts: [{ text }] },
      }
    )
    return response.data.embedding.values
  } catch (error) {
    console.error('Embedding error:', error.response?.data || error.message)
    throw new Error('Failed to generate embedding')
  }
}



export const generateCode = async (prompt) => {
  const enhancedPrompt = `You are an expert software developer.
Generate clean, production-ready, well-commented code for:

${prompt}

Requirements:
- Write complete working code
- Add helpful comments
- Follow best practices
- Include necessary imports

Return only the code with comments, no extra explanation.`

  return await callNemotron(enhancedPrompt)
}

export const explainCode = async (code) => {
  const enhancedPrompt = `You are an expert software developer and teacher.
Explain this code clearly and in detail:

\`\`\`
${code}
\`\`\`

Provide:
1. Overview of what the code does
2. Section by section explanation
3. Key concepts and patterns used
4. Any potential improvements

Be clear, detailed and beginner-friendly.`

  return await callNemotron(enhancedPrompt)
}

export const generateWithContext = async (prompt, context) => {
  const enhancedPrompt = `You are an expert software developer.

Here is relevant code context from the user's codebase:
---
${context}
---

Based on this code context, answer the following:
${prompt}

Be specific, reference the actual code, and give detailed answers.`

  return await callNemotron(enhancedPrompt)
}


export const callGemini = callNemotron