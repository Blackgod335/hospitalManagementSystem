import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import path from 'path';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const {ObjectId} = mongoose.Types;
dotenv.config()

import doctorModel from '../model/doctor.js';
import patientModel from '../model/patient.js';
import appointmentModel from '../model/appoinment.js';


const loginDoctor = async(req) => {
  try {
    const { email, password } = req.body
    const findUser = await doctorModel.findOne({
      email
    })
    const checkPassword = await bcrypt.compare(password, findUser.password)
    if (!checkPassword) {
      return {
        status : "NOTFOUND"
      }
    }
    let doctor = {
        _id : findUser._id,
        name : findUser.name,
        email : findUser.email
    }
    let token = jwt.sign(doctor, process.env.AUTH_KEY)
    
    return{
        message : "Login successfull",
        doctot : {
            _id : findUser._id,
            name : findUser.name,
            email : findUser.email
        },
        token : token
    }
  } catch (err) {
    return {
      message: err.message
    }
  }
}

const getPatientDetails = async (req) => {
  try {
    const data = req.query;
    const doctorId = req.authBody._id
    const sort = Number(data.sort ?? 1);
    const sortField = String(data.sortField ?? "patient.name");
    const limit = Number(data.limit ?? 10);
    const skip = Number(data.skip ?? 0);

    const showPatient = await appointmentModel.aggregate([
        {$match : {
            doctorId : new ObjectId(doctorId)
        }}, 
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
      {$unwind : '$patient.address'},
      {
        $project: {
          _id: 1,
          appointment:{
          date: 1,
          status: 1,},
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

    return {
      message: "Patient List",
      data: showPatient
    };
  } catch (err) {
    return {
      message: err.message
    };
  }
};

const downloadReport = async (req) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join('/home/zibtek/karuppu/TASK/hospital management system/uploads/', fileName);
    return {
      filePath
    };
  } catch (err) {
    return {
      message: err.message
    };
  }
};

const updatePatientDescription = async(req) =>{
    try{
        const {patientId, condition, description} = req.body;
        await patientModel.updateOne(
            {_id : new ObjectId(patientId)},
            {$set :
                {
                patientSymptoms : {
                    condition , description
                }
            }
            }
        )
        return{
            message : "Description Updated successfully"
        }
    }
    catch(err){
        return{
            message : err.message
        }
    }
}

const updateReport = async(req)=>{
    try{
        const fileName = req.file.path
        const patientId = req.params.patientId
        await patientModel.updateOne(
            {_id : new ObjectId(patientId)},
            {$set :
                {
                medicalReportFile : fileName
            }
            }
        )
        return{
            message : "report updated successfully"
        }
    }
    catch(err){
        return{
            message : err.message
        }
    }
}

const patientStatus = async(req) =>{
  try{
    const {appointmentId, status} = req.body;
    const updateStatus = await appointmentModel.findByIdAndUpdate(
      {_id : new ObjectId(appointmentId)},
      {$set : {
        appointment :{
          status
        }
      }}
    )
    return{
      message : "update status"
      
    }
  }
  catch(err){
    return{
      message : err.message
    }
  }
}


export { loginDoctor, getPatientDetails, updatePatientDescription, downloadReport, updateReport, patientStatus }