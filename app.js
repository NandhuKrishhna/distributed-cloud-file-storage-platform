import { open, readFile, readdir } from 'fs/promises'

import generateBoilerPlate from './utils/create_initial_boiler_plate.js'
import http from 'http'
import logger from './utils/logger.js'

const FILE_TYPES = ['images', 'pdf', 'mp4', 'docs']
const server = http.createServer(async (request, response) => {
  logger(request)

  try {
    if (request.url === '/') {
      const files = await readdir('./storage')
      return response.end(generateBoilerPlate(files))
    }

    if (request.url === '/favicon.ico') {
      const data = await readFile('./public/favicon.ico')
      return response.end(data)
    }

    const parts = request.url.split('/')
    if (parts[1] !== 'view') return

    const relativePath = decodeURIComponent(parts.slice(2).join('/'))

    const [type] = relativePath.split('/')

    const absolutePath = `./storage/${relativePath}`
    const file = await open(absolutePath)
    const stat = await file.stat()

    if (stat.isDirectory()) {
      const files = await readdir(absolutePath)
      response.end(generateBoilerPlate(files, relativePath))
    } else {
      file.createReadStream().pipe(response)
    }
  } catch (err) {
    const data = await readFile('./public/404.html')
    response.statusCode = 404
    response.end(data)
  }
})

server.listen(3000, () => {
  const address = server.address()
  console.log(`Server is running on ${address.address}:${address.port}`)
})
