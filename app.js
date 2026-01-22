import { generateBoilerPlate, logger } from './utils/index.js'
import { open, readFile, readdir } from 'fs/promises'

import http from 'http'
import path from 'path'
import mime from 'mime-types'

const server = http.createServer(async (request, response) => {
  logger(request)
  response.setHeader("Access-Control-Allow-Origin","*")
  const baseUrl = `http://${request.headers.host}`
  const parsedUrl = new URL(request.url, baseUrl)
  const pathname = decodeURIComponent(parsedUrl.pathname)
  const isDownload = parsedUrl.searchParams.get('download') === 'true'
  let fileHandle

  try {
    if (pathname === '/favicon.ico') {
      return response.end()
    }

    const relativePath = pathname.startsWith('/') ? pathname.slice(1) : pathname
    const absolutePath = `./storage/${relativePath}`

    fileHandle = await open(absolutePath)
    const stat = await fileHandle.stat()

    if (stat.isDirectory()) {
      const files = await readdir(absolutePath, { withFileTypes: true })
      console.log('Files',files)
      const responseFiles = files.map((file) => ({
        name: file.name,
        type: file.isDirectory() ? 'Directory' : 'File',
      }))

      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify(responseFiles))
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
        response.setHeader('Content-Length', stat.size)
      } else {
        // This allows the browser to render the video/image/PDF
        response.setHeader('Content-Type', contentType)
        response.setHeader('Content-Length', stat.size)
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
