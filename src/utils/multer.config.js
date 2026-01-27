import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = './storage';
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const id = new mongoose.Types.ObjectId();
    const extension = path.extname(file.originalname);
    file.id = id; // Attach to file object so controller can access it
    cb(null, id + extension);
  }
})

const upload = multer({ storage: storage })
export default upload
