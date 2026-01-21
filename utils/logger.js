const logger = (req) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`)
  // console.log('Headers:', req.headers)
}

export default logger
