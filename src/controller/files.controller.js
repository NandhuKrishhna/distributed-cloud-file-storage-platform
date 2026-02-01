import { DirectoryModel, FileModel } from '../models/index.js'
import { toObjectId } from '../utils/mongo.utils.js'
import path from 'path'

const uploadFileController = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const { originalname, size, filename } = req.file
    const { directory } = req.query
    const { availableStorage } = req.user
    if (availableStorage < size) {
      return res.status(400).json({ message: 'Not enough storage' })
    }

    // Extract ID from filename (filename is id + extension)
    const extension = path.extname(filename)
    const id = filename.substring(0, filename.length - extension.length)

    let parentId
    // Check if directory is provided and is a valid string (not "undefined" string from frontend)
    if (
      directory &&
      directory !== '' &&
      directory !== 'undefined' &&
      directory !== 'null'
    ) {
      parentId = toObjectId(directory)
    } else {
      const rootDirectory = await DirectoryModel.findOne({
        userId: req.user._id,
        isRootDirectory: true,
      })
      if (!rootDirectory) {
        return res.status(500).json({ message: 'User root directory missing' })
      }
      parentId = rootDirectory._id
    }
    const directoryDoc = await DirectoryModel.findById(parentId)

    const file = await FileModel.create({
      _id: toObjectId(id),
      name: originalname,
      extension: extension,
      size: size,
      userId: req.user._id,
      parentDirId: parentId,
      type: 'file',
    })
    // find all the parentIds of this directory if exit

    await directoryDoc.increaseSize(size)
    const user = req.user
    await user.decreaseSize(size)

    res
      .status(201)
      .json({ status: true, message: 'File uploaded successfully', data: file })
  } catch (error) {
    next(error)
  }
}

const getAllFilesController = async (req, res, next) => {
  try {
    const { folder } = req.query
    const absolutePath = path.join('/', folder)
    const full_path = folder ? `./storage/${absolutePath}` : './storage'
    const files = await readdir(full_path, { withFileTypes: true })
    const responseFiles = files.map((file) => ({
      name: file.name,
      type: file.isDirectory() ? 'Directory' : 'File',
    }))
    res.status(200).json(responseFiles)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ message: 'Folder not found' })
    }
    next(error)
  }
}

export { uploadFileController, getAllFilesController }
