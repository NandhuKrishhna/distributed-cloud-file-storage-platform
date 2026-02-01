import { model, Schema } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
import { compare, hash } from 'bcrypt'
const userSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    availableStorage: {
      type: Schema.Types.Number,
      default: 3 * 1024 ** 3,
      required: false,
    },
    totalStorage: {
      type: Schema.Types.Number,
      default: 3 * 1024 ** 3,
      required: false,
    },
  },
  { timestamps: true }
)

userSchema.plugin(aggregatePaginate)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await hash(this.password, 10)
})
userSchema.methods.comparePassword = async function (password) {
  return await compare(password, this.password)
}
userSchema.methods.increaseSize = async function (bytes) {
  this.availableStorage += bytes
  await this.save()
}
userSchema.methods.decreaseSize = async function (bytes) {
  this.availableStorage -= bytes
  await this.save()
}

const UserModel = model('User', userSchema)
export default UserModel
