import receptionistModel from '../model/receptionist.js'
import doctorModel from '../model/doctor.js'
import appoinmentModel from '../model/appoinment.js';
import patientModel from '../model/patient.js';
import createMessage from '../common/twilio.js';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { _date } from 'zod/v4/core';

dotenv.config()

const { ObjectId } = mongoose.Types

const loginReceptionist = async (req) => {
  try {
    const { email, password } = req.body
    const findUser = await receptionistModel.findOne({ email })
    const checkPassword = await bcrypt.compare(
      password,
      findUser.password
    )
    if (!checkPassword) {
      return {
        status: 'NOTFOUND',
      }
    }
    let receptionist = {
      _id: findUser._id,
      name: findUser.name,
      email: findUser.email
    }
    const token = jwt.sign(receptionist, process.env.AUTH_KEY)
    return {
      message: 'Login successfull',
      receptionist: {
        _id: findUser._id,
        name: findUser.name,
        email: findUser.email
      },
      token: token
    }
  } catch (err) {
    return {
      message: err.message
    }
  }
}

const createPatient = async (req) => {
  try {
    const { name, mobile, age, gender, patientSymptoms, address } = req.body;
    const createrId = req.authBody._id
    const createPatient = await patientModel.create({
      name,
      mobile,
      age,
      gender,
      patientSymptoms,
      address,
      createrId
    })
    return {
      message: 'register patient',
      patientDeatils: {
        name: createPatient.name,
        mobile: createPatient.mobile,
        age: createPatient.age,
        gender: createPatient.gender,
        patientSymptoms: createPatient.patientSymptoms,
        address: createPatient.address
      }
    }
  } catch (err) {
    return {
      message: err.message
    }
  }
}

const getPatientList = async (req) => {
  try {
    const data = req.query;
    const sort = Number(data.sort ?? 1);
    const limit = Number(data.limit ?? 10);
    const skip = Number(data.skip ?? 0);
    const name = String(data.name ?? "");

    const showPatient = await patientModel.aggregate([
      {
        $match: {
          name: { $regex: name }
        }
      },
      {
        $facet: {
          data: [
            { $sort: { "name": sort } },
            { $skip: skip },
            { $limit: limit }
          ],
          count: [
            { $count: "total count" }
          ]
        }
      }
    ]);

    return {
      message: "Patient List",
      showPatient
    };
  } catch (err) {
    return {
      message: err.message
    };
  }
};


const updatePatient = async (req) => {
  try {
    const { patientId, name, mobile, age, address, patientSymptoms } = req.body;
    const updatePatient = await patientModel.findByIdAndUpdate(
      { _id: new ObjectId(patientId) },
      {
        $set: {
          name, mobile, age, address, patientSymptoms
        }
      }
    )
    return {
      message: "user updated successfully"
    }
  }
  catch (err) {
    return {
      message: err.message
    }
  }
}

const getDoctor = async (req) => {
  try {
    const department = String(req.query.department);
    const name = String(req.query.name);
    const searchDoctors = await doctorModel.aggregate([
      {
        $match: {
          $or: [
            { department: { $regex: department, } },
            { name: { $regex: name, } }
          ]
        }
      },
      {
        $project: {
          name: 1,
          department: 1,
          role: 1,
          shift: 1,
          workStatus: 1
        }
      }
    ]);
    return {
      message: 'Doctors List',
      searchDoctors,
      count: searchDoctors.length
    }
  } catch (err) {
    return {
      message: err.message
    }
  }
}

const createAppointment = async (req) => {
  try {
    const { doctorId, patientId, date } = req.body;
    const dateNow = new Date(date);
    const year = dateNow.getUTCFullYear(), month = String(dateNow.getUTCMonth() + 1).padStart(2, '0'), dateDay = String(dateNow.getUTCDate()).padStart(2, '0');
    const start = new Date(`${year}-${month}-${dateDay}T00:00:00.000Z`);
    const end = new Date(start); end.setUTCDate(end.getUTCDate() + 1);
    const checkAppointmentList = await appoinmentModel.aggregate([
      {
        $match: {
          "appointment.date": { $gte: start, $lt: end }
        }
      }
    ]);
    if (checkAppointmentList.length == 20) {
      return {
        status: "LIMITREACH",
        message: "This day doctor reach has limited"
      }
    }
    const checkDate = await appoinmentModel.findOne({
      'appointment.date': new Date(date)
    })
    if (checkDate) {
      return {
        status: "DUPLICATE",
        message: "This time already appointment is here"
      }
    }
    const create = await appoinmentModel.create({
      doctorId,
      patientId,
      appointment: {
        date
      }
    })
    return {
      message: 'create appoinment',
      create
    }
  } catch (err) {
    return {
      message: err.message
    }
  }
}

const showAppoinment = async (req) => {
  try {
    const data = req.query;
    const sort = Number(data.sort ?? 1);
    const sortField = String(data.sortField ?? "patient.name");
    const limit = Number(data.limit ?? 10);
    const skip = Number(data.skip ?? 0);

    const getAppointment = await appoinmentModel.aggregate([
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctorId',
          foreignField: '_id',
          as: 'doctor'
        }
      },
      { $unwind: '$doctor' },
      {
        $lookup: {
          from: 'patients',
          localField: 'patientId',
          foreignField: '_id',
          as: 'patient'
        }
      },
      { $unwind: '$patient' },
      { $unwind: '$patient.address' },
      {
        $project: {
          _id: 1,
          appointment: {
            date: 1,
            status: 1,
          },
          doctor: {
            _id: "$doctor._id",
            name: "$doctor.name",
            department: "$doctor.department",
            shift: "$doctor.shift",
            workStatus: "$doctor.workStatus",
          },
          patient: {
            _id: "$patient._id",
            name: "$patient.name",
            age: "$patient.age",
            gender: "$patient.gender",
            address: "$patient.address",
            patientSymptoms: "$patient.patientSymptoms",
            medicalReportFile: "$patient.medicalReportFile",
          }
        }
      },
      {
        $facet: {
          data: [
            { $sort: { [sortField]: sort } },
            { $skip: skip },
            { $limit: limit }
          ],
          count: [
            { $count: "total count" }
          ]
        }
      }
    ]);

    const [result] = getAppointment;
    const count = result.count[0]?.["total count"] ?? 0;

    return {
      message: "Appointment List",
      data: result.data,
      total: count
    };
  } catch (err) {
    return {
      message: err.message
    };
  }
};


const updateAppointment = async (req) => {
  try {
    const { doctorId, appointmentId, appointment, } = req.body;
    const updateAppointment = await appoinmentModel.findByIdAndUpdate(
      { _id: new ObjectId(appointmentId) },
      {
        $set: {
          doctorId, appointment
        }
      }
    )
    return {
      message: "Appointment updated successfully"
    }
  }
  catch (err) {
    return {
      message: err.message
    }
  }
}

const uploadReport = async (req) => {
  try {
    const { patientId } = req.body;
    const fileName = req.file.path
    if (!fileName) {
      return {
        message: "Please upload a file"
      }
    }
    const uploadReport = await patientModel.findByIdAndUpdate(
      { _id: new ObjectId(patientId) },
      {
        $set: {
          medicalReportFile: fileName
        }
      }
    )
    return {
      message: "Report uploaded successfully"
    }
  }
  catch (err) {
    return {
      message: err.message
    }
  }
}


export {
  loginReceptionist, getDoctor, createAppointment, createPatient,
  showAppoinment, getPatientList, updatePatient, updateAppointment, uploadReport
}