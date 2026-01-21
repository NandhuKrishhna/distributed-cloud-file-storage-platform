import http from 'http'
import logger from './utils/logger.js'

const server = http.createServer((request, response) => {
  logger(request)
  response.end(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>My Files</h1>
</body>
</html>`)
})

server.listen(3000, () => {
  const address = server.address()
  console.log(`Server is running on ${address.address}:${address.port}`)
})
