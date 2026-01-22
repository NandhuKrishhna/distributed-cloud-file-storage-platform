import { generateBoilerPlate, logger } from './utils/index.js'
import { open, readFile, readdir } from 'fs/promises'

import http from 'http'
import path from 'path'
import mime from 'mime-types'

const server = http.createServer(async (request, response) => {
  logger(request)
  const baseUrl = `http://${request.headers.host}`
  const parsedUrl = new URL(request.url, baseUrl)
  const pathname = decodeURIComponent(parsedUrl.pathname)
  const isDownload = parsedUrl.searchParams.get('download') === 'true'
  let fileHandle

  try {
    if (pathname === '/') {
      const files = await readdir('./storage')
      return response.end(generateBoilerPlate(files))
    }
    if(pathname === '/favicon.ico'){
      return response.end()
    }

    const parts = pathname.split('/')
    if (parts[1] !== 'view') return
    const relativePath = parts.slice(2).join('/')
    const absolutePath = `./storage/${relativePath}`

    fileHandle = await open(absolutePath)
    const stat = await fileHandle.stat()

    if (stat.isDirectory()) {
      const files = await readdir(absolutePath)
      response.end(generateBoilerPlate(files, relativePath))
      await fileHandle.close() // Close immediately for directories
    } else {
      const ext = path.extname(absolutePath).toLowerCase()
      const contentType = mime.lookup(ext) || 'application/octet-stream'

      if (isDownload) {
        const fileName = relativePath.split('/').pop()
        response.setHeader(
          'Content-Disposition',
          `attachment; filename="${fileName}"`
        )
        response.setHeader('Content-Type', 'application/octet-stream')
      } else {
        // This allows the browser to render the video/image/PDF
        response.setHeader('Content-Type', contentType)
      }

      const stream = fileHandle.createReadStream()
      stream.pipe(response)

      stream.on('close', async () => {
        if (fileHandle) await fileHandle.close()
      })
    }
  } catch (err) {
    if (fileHandle) await fileHandle.close()
    console.error('Error caught:', err.message)
    const data = await readFile('./public/404.html')
    response.statusCode = 404
    response.end(data)
  }
})

server.listen(3000, () => {
  const address = server.address()
  console.log(`Server is running on ${address.address}:${address.port}`)
})
