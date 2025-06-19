import { z } from 'zod';

const loginReceptionist = z.object({
    email : z.string().email({message : "Enter valid email address"}),
    password : z.string()
})

const createPatient = z.object({
    name : z.string().min(3,{message : "name at least 3 letters"}),
    mobile : z.string().regex(/^\d{10}/, {message : "Enter a valid 10 digit mobile number"}),
    age : z.number().transform(data => Number(data)),
    gender : z.enum(['male', 'female', 'other']),
    medicalReport : z.object({
        condition : z.string(),
        description : z.string()
    }),
    address:z.array(z.object({
        street : z.string(),
        city : z.string(),
        zipCode : z.string()
    }))
})

const updatePatient = z.object({
    patientId : z.string(),
    name : z.string().min(3, {message : "name at least 3 letters"}),
    mobile : z.string().regex(/^\d{10}/, {message : "Enter a valid 10 digit mobile number"}),
    age : z.number().transform(data => Number(data)),
    gender : z.enum(['male', 'female', 'other']),
        medicalReport : z.object({
        condition : z.string(),
        description : z.string()
    }),
    address:z.array(z.object({
        street : z.string(),
        city : z.string(),
        zipCode : z.string()
    }))
})

const createAppointment = z.object({
    doctorId : z.string(),
    patientId : z.string(),
    appointment : z.object({
        date : z.date(),
        status : z.optional(z.enum(['upcoming', 'completed', 'cancelled']))
    })
})

const updateAppointment = z.object({
    doctorId : z.string(),
    appointmentId : z.string(),
    appointment : z.object({
        date : z.optional(z.date()),
        status : z.optional(z.enum(['upcoming', 'completed', 'cancelled']))
    })
})

const validate = (schema) => (req,res,next)=>{
    const result = schema.safeParse(req.body);
    if(!result){
        const errors = result.error.errors.map((err) => err.message);
        res.status(400).json({errors})
    }
    next()
}

export const loginReceptionistValidation = validate(loginReceptionist);
export const createPatientValidation = validate(createPatient);
export const updatePatientValidation = validate(updatePatient);
export const createAppointmentValidation = validate(createAppointment);
export const updateAppointmentValidation = validate(updateAppointment);