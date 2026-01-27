import { DirectoryModel, FileModel } from "../models/index.js";
import { toObjectId } from "../utils/mongo.utils.js";

const getDirectoryController = async (req, res, next) => {
    try {
        const { directoryId } = req.params;
        let parentId;

        if (directoryId) {
            parentId = toObjectId(directoryId);
        } else {
            const rootDir = await DirectoryModel.findOne({ userId: req.user._id, isRootDirectory: true });
            if (!rootDir) {
                // If no root directory exists, we might want to return an empty list or create one.
                // For now, assuming standard flow where root exists.
                return res.status(404).json({ message: "Root directory not found" });
            }
            parentId = rootDir._id;
        }

        const aggregateQuery = DirectoryModel.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    parentDirId: parentId
                }
            },
            {
                $project: {
                    name: 1,
                    isRootDirectory: 1,
                    type: { $literal: "directory" },
                    createdAt: 1,
                    updatedAt: 1
                }
            },
            {
                $unionWith: {
                    coll: "files",
                    pipeline: [
                        {
                            $match: {
                                userId: req.user._id,
                                parentDirId: parentId
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                extension: 1,
                                type: { $literal: "file" },
                                size: 1, 
                                createdAt: 1,
                                updatedAt: 1
                            }
                        }
                    ]
                }
            }
        ]);

        const directory = await DirectoryModel.aggregatePaginate(aggregateQuery, {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            sort: { isRootDirectory: -1, type: 1, name: 1 }
        });

        res.status(200).json({ status: true, message: "Directory fetched successfully", data: directory });

    } catch (error) {
        next(error);
    }
}
const createDirectoryController = async(req,res,next)=>{
    try {
     const {_id} = req.user;
     const {name , parentDirId} = req.body;
     const isRootDirectory = parentDirId === null;
     const directory = await DirectoryModel.create({
        name,
        userId : _id,
        parentDirId : parentDirId? toObjectId(parentDirId):null,
        isRootDirectory
     })
     console.log(directory)
     res.status(200).json({status : true , message : "Directory created successfully" , data : directory})
    } catch (error) {
        next(error)
    }
}

const deleteDirectoryController = async(req,res,next)=>{
    try {
        const {id} = req.params;
        // we should delete all the child directory and all the files inside
        const allChildDirectories = await DirectoryModel.distinct("parentDirId",{
            parentDirId : toObjectId(id)
        })
        const allFiles  = await FileModel.distinct("parentDirId",{
            parentDirId : toObjectId(id)
        })
        console.log({allChildDirectories:allChildDirectories})
        console.log({allFiles:allFiles})
        await DirectoryModel.deleteMany({
            parentDirId : {$in : allChildDirectories}
        })
        await FileModel.deleteMany({
            parentDirId : {$in : allFiles}
        })

        await DirectoryModel.deleteOne({
            _id : toObjectId(id)
        })

        res.status(200).json({status : true , message : "Directory deleted successfully" })
    } catch (error) {
        next(error)
    }
}

const renameDirectoryController = async(req, res,next)=>{
    try {
      const {id} = req.params;
      const {name} = req.body;
      const isDirectoryExist = await DirectoryModel.findOne({
        _id : toObjectId(id),
        userId : req.user._id
      })
      if(!isDirectoryExist){
        return res.status(404).json({status : false , message : "Directory not found"})
      }
      const directory = await DirectoryModel.findByIdAndUpdate(toObjectId(id),{name},{new:true})
      res.status(200).json({status : true , message : "Directory renamed successfully" , data : directory})   
    } catch (error) {
        next(error)
    }
}


export {getDirectoryController , createDirectoryController , deleteDirectoryController ,renameDirectoryController}