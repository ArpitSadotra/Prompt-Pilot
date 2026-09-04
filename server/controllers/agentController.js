import { createPlan, executeStep } from '../services/agentService.js'

export const runAgent = async (req, res) => {
  try {
    const { task } = req.body

    if (!task || task.trim() === '') {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide a task' })
    }

    // Step 1: Create plan
    const steps = await createPlan(task)

    // Step 2: Execute each step
    const outputs = []
    const results = []

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      const output = await executeStep(step, task, outputs)
      outputs.push(output)
      results.push({
        step,
        output,
        completed: true,
      })
    }

    res.status(200).json({
      success: true,
      task,
      plan: steps,
      results,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}