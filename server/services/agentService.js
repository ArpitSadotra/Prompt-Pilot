import { callGemini } from './aiService.js'

export const createPlan = async (task) => {
  const prompt = `You are an expert software architect and developer.

A user wants to: ${task}

Create a clear execution plan with exactly 4-5 steps.
Each step should be specific and actionable.

Return ONLY a valid JSON array of strings like this:
["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ..."]

No extra text, just the JSON array.`

  const response = await callGemini(prompt)

  try {
    const cleaned = response
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()
    const steps = JSON.parse(cleaned)
    return steps
  } catch (error) {
    return [
      'Step 1: Analyze requirements and plan structure',
      'Step 2: Create core files and configuration',
      'Step 3: Implement main functionality',
      'Step 4: Add error handling and validation',
      'Step 5: Review and finalize the code',
    ]
  }
}

export const executeStep = async (step, task, previousOutputs) => {
  const context =
    previousOutputs.length > 0
      ? `Previous completed steps:\n${previousOutputs
          .map((o, i) => `Step ${i + 1} output:\n${o}`)
          .join('\n\n')}`
      : 'This is the first step.'

  const prompt = `You are an expert software developer.

Overall task: ${task}

${context}

Now execute this specific step:
${step}

Provide complete, working code or detailed content for this step.
Be thorough and production-ready.`

  return await callGemini(prompt)
}