import mongoose from 'mongoose'

const Schema = mongoose.Schema

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    age: { type: Number, required: true },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true
    },
    address: [
      {
        street : String,
        city: String,
        zipCode: String
      }
    ],
    patientSymptoms: {
      condition: String,
      description: String,
    },
    medicalReportFile : String,
    visit : {type : Boolean, default : false},
    createdAt: { type: Date, default: Date.now },
    createrId: { type: Schema.Types.ObjectId, ref: 'receptionist' }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const patient = mongoose.model('patient', patientSchema)

export default patient
