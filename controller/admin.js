import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import adminModel from '../model/admin.js'
import patientModel from '../model/patient.js'
import doctorModel from '../model/doctor.js'
import receptionistModel from '../model/receptionist.js'

const { ObjectId } = mongoose.Types
dotenv.config()

const registerAdmin = async req => {
  try {
    const { firstName, lastName, email, password, mobile } = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const createAdmin = await adminModel.create({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword
    })
    let token = jwt.sign({ adminId: createAdmin._id }, process.env.AUTH_KEY)
    return {
      message: 'Admin created Successfully',
      createAdmin: {
        FullName: createAdmin.firstName + createAdmin.lastName,
        email: createAdmin.email,
        mobile: createAdmin.mobile
      },
      token: token
    }
  } catch (err) {
    return {
      message: err.message
    }
  }
}

const logInAdmin = async req => {
  try {
    const { email, password } = req.body
    const findUser = await adminModel.findOne({
      email
    })
    const checkPassword = await bcrypt.compare(password, findUser.password)
    if (!checkPassword) {
      return {
        status : 'NOTFOUND'
      }
    }
    let admin = {
       _id : findUser._id,
        firstName : findUser.firstName,
        lastName : findUser.lastName,
        email : findUser.email
    }
    let token = jwt.sign(admin, process.env.AUTH_KEY)

    return {
      message: 'Login Successful',
      admin :{
        _id : findUser._id,
        firstName : findUser.firstName,
        lastName : findUser.lastName,
        email : findUser.email
      },
      token: token
    }
  } catch (err) {
    return {
      message: err.message
    }
  }
}

const createDoctor = async req => {
  try {
    const {
      name,
      email,
      mobile,
      password,
      department,
      role,
      shift,
      workStatus
    } = req.body
    const hash = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, hash)
    const createrId = req.authBody._id;
    const createDoctor = await doctorModel.create({
      name,
      email,
      mobile,
      department,
      role,
      shift,
      workStatus,
      password: hashedPassword,
      createrId
    })
    return {
      message: 'Doctor created successfully',
      doctor: {
        name: createDoctor.name,
        email: createDoctor.email,
        mobile: createDoctor.mobile,
        department: createDoctor.department,
        role: createDoctor.role
      }
    }
  } catch (err) {
    return {
      message: err.message
    }
  }
}

const getDoctor = async req => {
  try {
    const data = req.query
    const sort = data.sort ? parseInt(data.sort) : 1
    const sortField = data.sortField ? String(data.sortField) : 'name'
    const limit = data.limit ? parseInt(data.limit) : 10
    const skip = data.skip ? parseInt(data.skip) : 0

    const showDoctor = await doctorModel.aggregate([
      {
        $project : {
          _id : 1,
          name : 1,
          email : 1,
          mobile : 1,
          role : 1,
          shift : 1,
          workStatus : 1
        }
      },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit },
            { $sort: { [sortField]: sort } }
          ],
          count: [{ $count: 'total count' }]
        }
      }
    ])
    return {
      message: 'Doctors List',
      showDoctor
    }
  } catch (err) {
    return {
      message: err.message
    }
  }
}

const updateDoctor = async req => {
  try {
    const {
      doctorId,
      name,
      email,
      mobile,
      department,
      role,
      workStatus,
      shift
    } = req.body
    const updateDoctor = await doctorModel.findByIdAndUpdate(
      { _id: new ObjectId(doctorId) },
      {
        $set: {
          name,
          email,
          mobile,
          role,
          department,
          workStatus,
          shift
        }
      }
    )
    return {
      message: 'updated successfully'
    }
  } catch (err) {
    return {
      message: err.message
    }
  }
}

const deleteDoctor = async req => {
  try {
    const { doctorId } = req.params
    await doctorModel.deleteOne({ _id: new ObjectId(doctorId) })
    return {
      message: 'Delete Successfully'
    }
  } catch (err) {
    return {
      message: err.message
    }
  }
}

const createReceptionist = async (req) => {
  try {
    const { name, email, password, mobile, status, shift } = req.body
    const findExistingEmail = await receptionistModel.findOne({ email })
    if (findExistingEmail) {
      return {
        status: 'DUPLICATE',
        message: 'This email id already registred'
      }
    }
    const hash = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, hash)
    const createrId = req.authBody._id
    const createReception = await receptionistModel.create({
      name,
      email,
      mobile,
      status,
      shift,
      password: hashedPassword,
      createrId
    })
    return {
      message: 'Receptionist created successfully',
      receptionistDetail: {
        name: createReception.name,
        email: createReception.email,
        mobile: createReception.mobile,
        status: createReception.status,
        shift: createReception.shift
      }
    }
  } catch (err) {
    return {
      message: err.message
    }
  }
}

const getAllRecptionist = async req => {
  try {
    const data = req.query
    const sortField = data.sortField ? String(data.sortField) : "name";
    const sort = data.sort ? parseInt(data.sort) : 1
    const limit = data.limit ? parseInt(data.limit) : 10
    const skip = data.skip ? parseInt(data.skip) : 0
    const getReception = await receptionistModel.aggregate([
      {
        $project : {
          _id :1,
          name : 1,
          email : 1,
          mobile : 1,
          status : 1,
          shift : 1,
          createdAt : 1
        }
      },
      {
        $facet: {
          data: [
            {
              $sort: { [sortField]: sort }
            },
            { $skip: skip },
            { $limit: limit }
          ],
          count : [
            {$count : "Total count"}
          ]
        }
      }
    ])
    return{
        message : "Receptionist List",
        getReception
    }
  } catch (err) {
    return {
      message: err.message
    }
  }
}

const updateRecptionist = async req => {
  try {
    const { receptionistId, name, email, mobile, status, shift } = req.body
     await receptionistModel.updateOne(
      { _id: new ObjectId(receptionistId) },
      {
        $set: {
          name,
          email,
          mobile,
          status,
          shift
        }
      }
    )
    return {
      message: 'Updated successfully',
    }
  } catch (err) {
    return {
      message: err.message
    }
  }
}

const deleteRecptionist = async req => {
  try {
    const {receptionistId} = req.params
    await receptionistModel.deleteOne({ _id: new ObjectId(receptionistId) })
    return {
      message: 'Successfully deleted'
    }
  } catch (err) {
    return {
      message: err.message
    }
  }
}

const getAllPatient = async req => {
  try {
    const data = req.query
    const sortField = data.sortField
    const sort = data.sort ? parseInt(data.sort) : 1
    const limit = data.limit ? parseInt(data.limit) : 10
    const skip = data.skip ? parseInt(data.skip) : 0
    const getPatient = await patientModel.aggregate([
      {
        $facet: {
          data: [
            {
              $sort: { [sortField]: sort }
            },
            { $skip: skip },
            { $limit: limit }
          ]
        }
      }
    ])
    return {
      message: 'Patient List',
      getPatient
    }
  } catch (err) {
    return {
      message: err.message
    }
  }
}

export {
  registerAdmin,
  logInAdmin,
  createDoctor,
  getDoctor,
  updateDoctor,
  deleteDoctor,
  createReceptionist,
  getAllRecptionist,
  updateRecptionist,
  deleteRecptionist,
  getAllPatient
}
