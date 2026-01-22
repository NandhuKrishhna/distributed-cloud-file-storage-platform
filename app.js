import {  logger } from './utils/index.js'
import { open, readFile, readdir, unlink } from 'fs/promises'

import http from 'http'
import path from 'path'
import mime from 'mime-types'
import { createWriteStream } from 'fs'

const server = http.createServer(async (request, response) => {
  logger(request)
  response.setHeader("Access-Control-Allow-Origin","*")
  response.setHeader("Access-Control-Allow-Headers","*")
  response.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS")
  const baseUrl = `http://${request.headers.host}`
  const parsedUrl = new URL(request.url, baseUrl)
  const pathname = decodeURIComponent(parsedUrl.pathname)
  const isDownload = parsedUrl.searchParams.get('download') === 'true'
  let fileHandle

  try {
    if(request.method === "GET"){
      if (pathname === '/favicon.ico') {
      return response.end()
    }

    const relativePath = pathname.startsWith('/') ? pathname.slice(1) : pathname
    const absolutePath = `./storage/${relativePath}`

    fileHandle = await open(absolutePath)
    const stat = await fileHandle.stat()

    if (stat.isDirectory()) {
      await fileHandle.close()
      fileHandle = undefined
      const files = await readdir(absolutePath, { withFileTypes: true })
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
        if (fileHandle) {
             await fileHandle.close()
             fileHandle = undefined
        }
      })
    }
    }else if(request.method === "OPTIONS"){
      response.end("OK")
    }else if(request.method === "POST"){
      const folderPath = request.headers.folder
      const absolutePath = folderPath 
      ? `${`./storage/${folderPath}/${request.headers.filename}`}` 
      : `./storage/${request.headers.filename}`
      const fileWriteStream = createWriteStream(absolutePath)
      request.pipe(fileWriteStream)
      fileWriteStream.on("finish",()=>{
        response.end("Upload complete")
      })
    }else if(request.method === "PUT"){
      
    }else if(request.method === "DELETE"){
      const decodedPath = decodeURIComponent(request.url)
      const deleteFilePath = `./storage/${decodedPath}`
      await unlink(deleteFilePath)
      response.end("File deleted successfully")
    }else if(request.method === "PATCH"){
      const decodedPath = decodeURIComponent(request.url)
      const renameFilePath = `./storage/${decodedPath}`
      const newPath = `./storage/${request.body.newName}`
      await rename(renameFilePath,newPath)
      response.end("File renamed successfully")
    }else {
      response.end("Method Not Allowed")
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
