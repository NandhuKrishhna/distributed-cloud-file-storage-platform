import { DirectoryModel, FileModel } from "../models/index.js";
import { toObjectId } from "../utils/mongo.utils.js";
import path from "path";

const uploadFileController = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const { originalname, size, filename } = req.file;
        const { directory } = req.query; 

        // Extract ID from filename (filename is id + extension)
        const extension = path.extname(filename);
        const id = filename.substring(0, filename.length - extension.length);

        let parentId;
        // Check if directory is provided and is a valid string (not "undefined" string from frontend)
        if (directory && directory !== "" && directory !== "undefined" && directory !== "null") {
             parentId = toObjectId(directory);
        } else {
             const rootDirectory = await DirectoryModel.findOne({ userId: req.user._id, isRootDirectory: true });
             if(!rootDirectory) {
                 return res.status(500).json({ message: "User root directory missing" });
             }
             parentId = rootDirectory._id;
        }
        
        const file = await FileModel.create({
            _id: toObjectId(id),
            name: originalname,
            extension: extension,
            size: size,
            userId: req.user._id,
            parentDirId: parentId,
            type: "file" 
        });

        res.status(201).json({ status: true, message: "File uploaded successfully", data: file });
    } catch (error) {
        next(error);
    }
};

export { uploadFileController };
