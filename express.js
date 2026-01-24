import express from "express";
import { createWriteStream } from "fs";
import { mkdir, readdir, rename, unlink } from "fs/promises";
import cors from "cors"
const PORT = 3000
const app = express()
app.use(express.json())
const allowedHeaders = ["Content-Type", "Authorization"]; 
const allowedMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
const allowedOrigin = ["http://localhost:5173", "http://192.168.1.4:5173"];

app.use(cors({
    origin: allowedOrigin,
    methods: allowedMethods,
    allowedHeaders: allowedHeaders, 
    credentials: true
}));

// 3. Static File Serving
app.use(express.static("storage"))
app.get("/files", async (req, res) => {
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

app.post('/files/upload', async (req, res, next) => {
    try {
        console.log(req.query)
        const { folder , fileName } = req.query
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
         next(err)
      })
    } catch (error) {
        console.log(error)
        next(error)
    }
})

app.patch('/files/rename/:oldName', async(req,res)=>{
    try {
       const {newName , folder} = req.body;
       const {oldName} = req.params
       const absolutePath = folder ? `./storage/${folder}/${oldName}` : `./storage/${oldName}`
       const newAbsolutePath = folder ? `./storage/${folder}/${newName}` : `./storage/${newName}`
        await rename(absolutePath, newAbsolutePath)
        res.status(200).json({ message: "File renamed successfully" })
    } catch (error) {
        console.log(error)
        next(error)
    }
})

app.delete('/files/delete', async(req,res)=>{
    try {
        const {filePath} = req.query
        const absolutePath = `./storage/${filePath}`
        await unlink(absolutePath)
        res.status(200).json({ message: "File deleted successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "File upload failed" })
    }
})
app.get('/files/download', async(req,res)=>{
    try {
        console.log(req.query)
        const {filePath} = req.query
        const absolutePath = `./storage/${filePath}`
        res.download(absolutePath)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "File upload failed" })
    }
})

app.post('/folder/create', async(req,res)=>{
    try {
        const {directoryPath} = req.query;
        const {folderName} = req.body
        const absolutePath = directoryPath ?  `./storage/${directoryPath}/${folderName}` :`./storage/${folderName}`; 
        await mkdir(absolutePath, {recursive: true})
        res.status(200).json({ message: "Folder created successfully" })
    } catch (error) {
        console.log(error)
        next(error)
    }
})
app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ error: err.message ||  "Internal Server Error" })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})