import { model, Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const directorySchema = new Schema(
  {
    name: {
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
      default: null,
      ref: "Directory",
    },
    isRootDirectory :{
      type: Schema.Types.Boolean,
      default :false,
    },
    type:{
      type: Schema.Types.String,
      default :"directory",
      required:false
    }
  },
  {
    timestamps:true,
  }
);

directorySchema.plugin(aggregatePaginate)

const DirectoryModel = model("Directory", directorySchema);

export default DirectoryModel;