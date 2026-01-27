import { model, Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const fileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    extension: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    parentDirId: {
      type: Schema.Types.ObjectId,
      ref: "Directory",
    },
    type:{
      type: Schema.Types.String,
      default :"file",
      required:false
    },
    size: {
        type: Number,
        required: true
    }
  },
  {
    timestamps:true,
  }
);

fileSchema.plugin(aggregatePaginate)

const FileModel = model("File", fileSchema);
export default FileModel;