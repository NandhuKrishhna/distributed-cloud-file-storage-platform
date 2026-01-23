import express from "express";
import { createWriteStream } from "fs";
import { readdir, rename, unlink } from "fs/promises";
const PORT = 3000
const app = express()
app.use(express.json())



// 1. Logger & CORS Middleware - MUST come first to run for all requests
app.use((req,res , next )=>{
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`)
    res.set("Access-Control-Allow-Origin","*")
    res.set("Access-Control-Allow-Headers","*")
    res.set("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS,PATCH")
    next()
})

// 2. Custom Download Middleware
app.use((req, res, next) => {
    if(req.method === 'GET' && req.query.action === "download"){
        // Construct the full file path. 
        // req.path decodes the URL (e.g., %20 becomes space), which is what we want for fs access
        const filePath = `./storage${req.path}` 
        return res.download(filePath, (err) => {
             if (err) {
                 // Check if headers were sent to avoid double-response errors
                 if (!res.headersSent) {
                    console.error("Download error:", err)
                    res.status(404).json({error: "File not found"})
                 }
             }
        })
    }
    next()
})

// 3. Static File Serving
app.use(express.static("storage"))
app.get("/", async (req, res) => {
    try {
       const {folder} = req.query
       const path = folder ? `./storage/${folder}` : "./storage"

        const files = await readdir(path, { withFileTypes: true })
    const responseFiles = files.map((file) => ({
        name: file.name,
        type: file.isDirectory() ? 'Directory' : 'File',
      }))
    res.status(200).json(responseFiles)
    } catch (error) {
        console.log(error)
        next(error)
    }
    
})

app.post('/', async (req, res, next) => {
    try {
        const { folder } = req.query
        const fileName = req.headers.filename
        if(!fileName){
            return res.status(400).json({ error: "File name is required" })
        }
        const absolutePath = folder ? `./storage/${folder}/${fileName}` : `./storage/${fileName}`
        
      const fileWriteStream = createWriteStream(absolutePath)
            req.pipe(fileWriteStream)
            fileWriteStream.on('finish', () => {
                res.status(201).json({ message: "File uploaded successfully" })
            })
            fileWriteStream.on('error', (err) => {
                console.error(err)
                res.status(500).json({ error: "File upload failed" })
            })
    } catch (error) {
        console.log(error)
        next(error)
    }
})

app.patch('/', async(req,res)=>{
    try {
       const {newName , oldName , folder} = req.body;
       const absolutePath = folder ? `./storage/${folder}/${oldName}` : `./storage/${oldName}`
       const newAbsolutePath = folder ? `./storage/${folder}/${newName}` : `./storage/${newName}`
        await rename(absolutePath, newAbsolutePath)
        res.status(200).json({ message: "File renamed successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "File upload failed" })
    }
})

app.delete('/', async(req,res)=>{
    try {
        const {filePath} = req.body
        const absolutePath = `./storage/${filePath}`
        await unlink(absolutePath)
        res.status(200).json({ message: "File deleted successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "File upload failed" })
    }
})

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ error: err.message ||  "Internal Server Error" })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})