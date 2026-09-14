import axios from 'axios'

// ===== CALL NEMOTRON WITH RETRY =====
const callNemotron = async (prompt, useReasoning = false, retries = 2) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Nemotron attempt ${attempt}/${retries}...`)

      const requestBody = {
        model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4096,
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
            'HTTP-Referer': 'https://prompt-pilot-a0m4.onrender.com',
            'X-Title': 'PromptPilot',
          },
          timeout: 60000,
        }
      )

      const content = response.data?.choices?.[0]?.message?.content

      if (content && content.trim().length > 0) {
        console.log('✅ Nemotron responded successfully')
        return content
      }

      console.log(`Attempt ${attempt}: Empty response, retrying...`)
    } catch (error) {
      console.error(
        `Attempt ${attempt} failed:`,
        error.response?.data || error.message
      )

      if (attempt === retries) {
        // Try fallback model on last attempt
        return await callFallback(prompt)
      }

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  return await callFallback(prompt)
}

// ===== FALLBACK TO GEMINI IF NEMOTRON FAILS =====
const callFallback = async (prompt) => {
  try {
    console.log('⚠️ Falling back to Gemini...')

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      },
      { timeout: 30000 }
    )

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (text && text.trim().length > 0) {
      console.log('✅ Fallback Gemini responded successfully')
      return text
    }

    throw new Error('Both Nemotron and Gemini failed')
  } catch (error) {
    console.error('Fallback error:', error.message)
    throw new Error('All AI services failed. Please try again.')
  }
}

// ===== AI FEATURES =====

export const generateCode = async (prompt) => {
  const enhancedPrompt = `You are an expert software developer.
Generate clean, production-ready, well-commented code for:

${prompt}

Requirements:
- Write complete working code
- Add helpful comments
- Follow best practices
- Include necessary imports

Return only the code with comments.`

  return await callNemotron(enhancedPrompt)
}

export const explainCode = async (code) => {
  const enhancedPrompt = `You are an expert software developer and teacher.
Explain this code clearly:

\`\`\`
${code}
\`\`\`

Provide:
1. Overview of what the code does
2. Section by section explanation
3. Key concepts used
4. Potential improvements

Be clear and beginner-friendly.`

  return await callNemotron(enhancedPrompt)
}

export const generateWithContext = async (prompt, context) => {
  const enhancedPrompt = `You are an expert software developer.

Here is relevant code context:
---
${context}
---

Based on this code, answer:
${prompt}

Be specific and reference the actual code.`

  return await callNemotron(enhancedPrompt)
}

export const callGemini = callNemotron