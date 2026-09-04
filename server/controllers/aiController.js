import { generateCode, explainCode } from '../services/aiService.js'

export const generate = async (req, res) => {
  try {
    const { prompt } = req.body

    if (!prompt || prompt.trim() === '') {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide a prompt' })
    }

    const response = await generateCode(prompt)

    res.status(200).json({
      success: true,
      response,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const explain = async (req, res) => {
  try {
    const { code } = req.body

    if (!code || code.trim() === '') {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide code to explain' })
    }

    const response = await explainCode(code)

    res.status(200).json({
      success: true,
      response,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}