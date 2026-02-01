import { Router } from 'express'
import path from 'path'
import { readdir, unlink } from 'fs/promises'
import upload from '../utils/multer.config.js'
import {
  getAllFilesController,
  uploadFileController,
} from '../controller/files.controller.js'
import FileModel from '../models/files.models.js'
const fileRouter = Router()

fileRouter.get('/', getAllFilesController)

fileRouter.post('/upload', upload.single('file'), uploadFileController)

fileRouter.patch('/rename/:id', async (req, res, next) => {
  try {
    const { newName } = req.body
    const { id } = req.params
    const isFileExit = await FileModel.findById(id)
    if (!isFileExit) {
      return res.status(404).json({ message: 'File not found' })
    }
    const updatedFile = await FileModel.findByIdAndUpdate(id, { name: newName })
    res.status(200).json({ message: 'File renamed successfully', updatedFile })
  } catch (error) {
    next(error)
  }
})

fileRouter.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const isFileExit = await FileModel.findById(id)
    if (!isFileExit) {
      return res.status(404).json({ message: 'File not found' })
    }
    const fullFilePath = `${isFileExit._id}${isFileExit.extension}`
    await FileModel.findByIdAndDelete(id)
    const absoluteFolderName = path.join('/', fullFilePath)

    const absolutePath = `./storage/${absoluteFolderName}`
    await unlink(absolutePath)
    const directoryDoc = await DirectoryModel.findById(isFileExit.parentDirId)
    await directoryDoc.decreaseSize(isFileExit.size)
    res.status(200).json({ message: 'File deleted successfully' })
  } catch (error) {
    next(error)
  }
})
fileRouter.get('/download', async (req, res) => {
  try {
    const { filePath } = req.query
    const absoluteFolderName = path.join('/', filePath)
    const absolutePath = `./storage/${absoluteFolderName}`
    res.download(absolutePath)
  } catch (error) {
    next(error)
  }
})

export default fileRouter
