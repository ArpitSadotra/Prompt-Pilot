import jwt from 'jsonwebtoken'

const isAuthenticated = async (req, res, next) => {
  try {
    let token

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.substring(7)
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Please login first' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: decoded.id }
    next()
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: 'Invalid or expired token' })
  }
}

export default isAuthenticated