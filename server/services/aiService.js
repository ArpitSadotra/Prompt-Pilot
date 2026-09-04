import axios from 'axios'

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent';

export const callGemini = async (prompt) => {
  try {
    const response = await axios.post(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      }
    )

    return response.data.candidates[0].content.parts[0].text
  } catch (error) {
    console.error('Gemini error:', error.response?.data || error.message)
    throw new Error('Failed to get AI response')
  }
}

export const generateCode = async (prompt) => {
  const enhancedPrompt = `You are an expert software developer.
Generate clean, production-ready, well-commented code for the following request:

${prompt}

Requirements:
- Write complete, working code
- Add helpful comments
- Follow best practices
- Include any necessary imports

Return only the code with comments, no extra explanation.`

  return await callGemini(enhancedPrompt)
}

export const explainCode = async (code) => {
  const enhancedPrompt = `You are an expert software developer and teacher.
Explain the following code in a clear, beginner-friendly way:

\`\`\`
${code}
\`\`\`

Provide:
1. Overview of what the code does
2. Line by line or section by section explanation
3. Key concepts used
4. Any potential improvements

Be clear and educational.`

  return await callGemini(enhancedPrompt)
}

export const generateWithContext = async (prompt, context) => {
  const enhancedPrompt = `You are an expert software developer.
  
Here is relevant context from the user's codebase:
---
${context}
---

Based on this context, answer the following:
${prompt}

Be specific and reference the actual code when relevant.`

  return await callGemini(enhancedPrompt)
}