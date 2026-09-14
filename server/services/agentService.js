import axios from 'axios'

const callNemotron = async (prompt, useReasoning = false) => {
  try {
    const requestBody = {
      model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
      messages: [{ role: 'user', content: prompt }],
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

    return response.data?.choices?.[0]?.message?.content || ''
  } catch (error) {
    console.error('Agent Nemotron error:', error.response?.data || error.message)
    throw new Error('Agent AI request failed')
  }
}

export const createPlan = async (task) => {

  const prompt = `You are an expert software architect.

Task: ${task}

Create a detailed execution plan with exactly 4 steps.
Think carefully about the best approach.

Return ONLY a valid JSON array of strings, nothing else.
Example: ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ..."]

JSON array:`

  try {

    const response = await callNemotron(prompt, true)

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

    throw new Error('Invalid plan format')
  } catch (error) {
    console.error('Plan error:', error.message)
    return [
      'Step 1: Set up project structure and configuration',
      'Step 2: Implement core models and database schemas',
      'Step 3: Build main functionality and business logic',
      'Step 4: Add error handling, validation and finalize',
    ]
  }
}

export const executeStep = async (step, task, previousOutputs) => {
  const context =
    previousOutputs.length > 0
      ? `Previously completed steps:\n${previousOutputs
          .map((o, i) => `--- Step ${i + 1} ---\n${o}`)
          .join('\n\n')}`
      : 'This is the first step.'

  const prompt = `You are an expert software developer.

Overall task: ${task}

${context}

Now execute this specific step:
${step}

Provide complete, production-ready code with comments.
Be thorough and detailed.`


  return await callNemotron(prompt, true)
}