import mongoose from 'mongoose'

const receptionistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['temporary', 'permanent'],
      default: 'temporary'
    },
    shift: {
      type: String,
      enum: ['DAY', 'NIGHT'],
      required: true,
      default: 'DAY'
    },
    createdAt: { type: Date, default: Date.now() },
    createrId : {type : mongoose.Schema.Types.ObjectId, ref: "admin"}
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const receptionist = mongoose.model('receptionist', receptionistSchema)

export default receptionist
