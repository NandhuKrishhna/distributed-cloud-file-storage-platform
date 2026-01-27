import { Router } from "express"
import path from "path"
import { createWriteStream } from "fs";
import { readdir, rename, unlink } from "fs/promises";
import upload from "../utils/multer.config.js";
import { uploadFileController } from "../controller/files.controller.js";
import FileModel from "../models/files.models.js";
const fileRouter = Router()

fileRouter.get("/", async (req, res, next) => {
    try {
       const {folder} = req.query
       const absolutePath = path.join("/", folder)
       const full_path = folder ? `./storage/${absolutePath}` : "./storage"
        const files = await readdir(full_path, { withFileTypes: true })
    const responseFiles = files.map((file) => ({
        name: file.name,
        type: file.isDirectory() ? 'Directory' : 'File',
      }))
    res.status(200).json(responseFiles)
    } catch (error) {
        if (error.code === 'ENOENT') {
            return res.status(404).json({ message: "Folder not found" });
        }
        next(error)
    }
})

fileRouter.post('/upload', upload.single('file'), uploadFileController)

fileRouter.patch('/rename/:id', async(req,res,next)=>{
    try {
       const {newName} = req.body;
       const {id} = req.params
       const isFileExit = await FileModel.findById(id)
       if(!isFileExit){
        return res.status(404).json({ message: "File not found" })
       }
       const updatedFile = await FileModel.findByIdAndUpdate(id, { name: newName })
        res.status(200).json({ message: "File renamed successfully" , updatedFile})
    } catch (error) {
        console.log(error)
        next(error)
    }
})

fileRouter.delete('/:id', async(req,res,next)=>{
    try {
        const {id} = req.params
        const isFileExit = await FileModel.findById(id)
        if(!isFileExit){
            return res.status(404).json({ message: "File not found" })
        }
        const fullFilePath = `${isFileExit._id}${isFileExit.extension}`
        console.log({fullFilePath:fullFilePath})
        await FileModel.findByIdAndDelete(id)
        const absoluteFolderName = path.join("/", fullFilePath)

        const absolutePath = `./storage/${absoluteFolderName}`
        await unlink(absolutePath)
        res.status(200).json({ message: "File deleted successfully" })
    } catch (error) {
        next(error)
    }
})
fileRouter.get('/download', async(req,res)=>{
    try {
        console.log(req.query)
        const {filePath} = req.query
        const absoluteFolderName = path.join("/", filePath)
        const absolutePath = `./storage/${absoluteFolderName}`
        res.download(absolutePath)
    } catch (error) {
      next(error)
    }
})


export default fileRouter