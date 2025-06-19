import mongoose from 'mongoose'

const Schema = mongoose.Schema

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor' },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient' },
    appointment: {
      date: { type: Date, required : true, },
      status: {
        type: String,
        enum: ['upcoming', 'completed', 'cancelled'],
        default: 'upcoming'
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)


const appointment = mongoose.model('appointment', appointmentSchema)

export default appointment;
