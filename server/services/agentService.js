import axios from 'axios'

const callNemotron = async (prompt, useReasoning = false, retries = 2) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Agent Nemotron attempt ${attempt}/${retries}...`)

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
        return content
      }

      console.log(`Agent attempt ${attempt}: Empty response, retrying...`)
    } catch (error) {
      console.error(
        `Agent attempt ${attempt} failed:`,
        error.response?.data || error.message
      )

      if (attempt === retries) {
        return await callGeminiFallback(prompt)
      }

      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  return await callGeminiFallback(prompt)
}

const callGeminiFallback = async (prompt) => {
  try {
    console.log('⚠️ Agent falling back to Gemini...')

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

    if (text) return text
    throw new Error('Gemini fallback failed')
  } catch (error) {
    console.error('Agent fallback error:', error.message)
    throw new Error('AI service unavailable. Please try again.')
  }
}

export const createPlan = async (task) => {
  const prompt = `You are an expert software architect.

Task: ${task}

Create an execution plan with exactly 4 steps.
Return ONLY a valid JSON array of 4 strings, nothing else.
Example: ["Step 1: Setup", "Step 2: Models", "Step 3: Logic", "Step 4: Testing"]

JSON:`

  try {
    const response = await callNemotron(prompt)

    const cleaned = response
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim()

    const match = cleaned.match(/\[[\s\S]*?\]/)
    if (match) {
      const steps = JSON.parse(match[0])
      if (Array.isArray(steps) && steps.length > 0) {
        return steps
      }
    }

    throw new Error('Invalid plan')
  } catch (error) {
    console.error('Plan error:', error.message)
    return [
      'Step 1: Set up project structure and configuration',
      'Step 2: Implement core models and database schemas',
      'Step 3: Build main functionality and business logic',
      'Step 4: Add error handling and finalize the code',
    ]
  }
}

export const executeStep = async (step, task, previousOutputs) => {
  const context =
    previousOutputs.length > 0
      ? `Previously completed:\n${previousOutputs
          .map((o, i) => `--- Step ${i + 1} ---\n${o}`)
          .join('\n\n')}`
      : 'This is the first step.'

  const prompt = `You are an expert software developer.

Main task: ${task}

${context}

Execute this step now:
${step}

Provide complete, production-ready code.`

  return await callNemotron(prompt)
}