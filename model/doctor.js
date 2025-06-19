import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name :{type: String, required : true},
    email : {type: String, required : true, unique: true},
    password : {type:String, required: true},
    mobile : {type : String, required : true},
    department :{
        type : String,
        enum : ["skindoctor", "eyedoctor", "generaldoctor", "childdoctor", "borndoctor","pshchiatrist"],
    },
    role : {
        type : String,
        enum : ["temporary", "permanent"],
        default : "temporary"
    },
    shift : {
        type : String,
        enum : ["DAY", "NIGHT"],
        default : "DAY"
    },
    workStatus:{
        type : String,
        enum : ["WORK", "LEAVE"]
    },
    createdAt : {type : Date, default: Date.now()},
    createrId : {type : mongoose.Schema.Types.ObjectId , ref: "admin"}
},{
    timestamps : true,
    versionKey : false
});


const doctor = mongoose.model('doctor', doctorSchema)

export default doctor;