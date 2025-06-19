import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    firstName : {type : String, required : true},
    lastName : String,
    mobile : {type: String, required : true},
    email : {type : String, required : true, unique : true},
    password :{type : String, required : true}
},{
    timestamps : true,
    versionKey : false
})

const admin = mongoose.model('admin', adminSchema)

export default admin