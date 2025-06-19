import { z } from "zod/v4";

const registerAdmin = z.object({
    firstName : z.string().min(3,{message : "firstName at least 3 letter"}),
    lastName : z.string().min(3,{message : "lastName at least 3 letter"}),
    email : z.string().email({message : "Enter valid email address"}),
    password : z.string().min(8,{message : "password must be 8 letters"}),
    mobile : z.string().regex(/^\d{10}$/, { message: "Enter a valid 10-digit Mobile Number" }),
})

const logInAdmin = z.object({
    email : z.string().email({message : "Enter valid email address"}),
    password :z.string()
})

const createDoctor = z.object({
    name : z.string().min(3,{message : "name is at least"}),
    email : z.string().email({message : "enter valid email address"}),
    mobile : z.string().regex(/^\d{10}$/,{message : "Enter a valid 10 digit mobile Number"}),
    password : z.string().min(8,{message : "Password must be 8 letters"}),
    department : z.enum(["skindoctor", "eyedoctor", "generaldoctor", "childdoctor", "borndoctor","pshchiatrist"]),
    role : z.enum(["temporary", "permanent"]),
    shift : z.enum(["DAY", "NIGHT"]),
    workStatus : z.enum(["WORK", "LEAVE"])
});

const updateDoctor = z.object({
    doctorId : z.string(),
    name : z.string().min(3,{message : "name at least 3 letter"}),
    email : z.string().email({message : "Enter valid  email address"}),
    mobile : z.string().regex(/^\d{10}/, {message : "Enter a valid 10 digit mobile Number"}),
    department : z.enum(["skindoctor", "eyedoctor", "generaldoctor", "childdoctor", "borndoctor","pshchiatrist"]),
    role : z.enum(["temporary", "permanent"]),
    shift : z.enum(["DAY", "NIGHT"]),
    workStatus : z.enum(["WORK", "LEAVE"])
})

const createReceptionist = z.object({
    name : z.string().min(3, {message : "name at least 3 letter"}),
    email : z.string().email({message : "Enter valid email address"}),
    password : z.string().min(8,{message : "Password must be 8 letters"}),
    mobile : z.string().regex(/^\d{10}/, {message : "Enter a valid 10 digit mobile Number"}),
    status : z.enum(['temporary', 'permanent']),
    shift : z.enum(['DAY', 'NIGHT'])
})

const updateRecptionist = z.object({
    receptionistId : z.string(),
    name : z.string().min(3, {message : "name at least 3 letter"}),
    email : z.string().email({message : "Enter valid email address"}),
    mobile : z.string().regex(/^\d{10}/, {message : "Enter a valid 10 digit mobile Number"}),
    status : z.enum(['temporary', 'permanent']),
    shift : z.enum(['DAY', 'NIGHT'])
})

const validate = (schema) => (req,res,next) => {
    const result = schema.safeParse(req.body);
    if (!result){
        const errors = result.error.errors.map((err) => err.message);
        return res.status(400).json({errors})
    }
    next()
}

export const registerAdminValidation = validate(registerAdmin);
export const logInAdminValidation = validate(logInAdmin);
export const createDoctorValidation = validate(createDoctor);
export const updateDoctorValidation = validate(updateDoctor);
export const createReceptionistValidation = validate(createReceptionist);
export const updateRecptionistValidation = validate(updateRecptionist);