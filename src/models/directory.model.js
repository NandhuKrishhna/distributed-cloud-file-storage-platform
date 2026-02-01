import { model, Schema } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const directorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parentDirId: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: 'Directory',
    },
    isRootDirectory: {
      type: Schema.Types.Boolean,
      default: false,
    },
    type: {
      type: Schema.Types.String,
      default: 'directory',
      required: false,
    },
    size: {
      type: Schema.Types.Number,
      default: 0,
      required: false,
    },
  },
  {
    timestamps: true,
  }
)

directorySchema.methods.increaseSize = async function (bytes) {
  this.size += bytes
  await this.save()
  if (this.parentDirId) {
    const parent = await this.model('Directory').findById(this.parentDirId)
    if (parent) {
      await parent.increaseSize(bytes)
    }
  }
}

directorySchema.methods.decreaseSize = async function (bytes) {
  this.size -= bytes
  await this.save()
  if (this.parentDirId) {
    const parent = await this.model('Directory').findById(this.parentDirId)
    if (parent) {
      await parent.decreaseSize(bytes)
    }
  }
}

directorySchema.plugin(aggregatePaginate)

const DirectoryModel = model('Directory', directorySchema)

export default DirectoryModel
