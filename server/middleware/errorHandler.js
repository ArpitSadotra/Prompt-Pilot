const errorHandler = (err, req, res, next) => {
  let message = err.message || 'Server Error'
  let statusCode = err.statusCode || 500

  if (err.code === 11000) {
    message = 'Duplicate field value entered'
    statusCode = 400
  }

  if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ')
    statusCode = 400
  }

  res.status(statusCode).json({
    success: false,
    message,
  })
}

export default errorHandler