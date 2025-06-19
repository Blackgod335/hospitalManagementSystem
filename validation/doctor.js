import { z } from 'zod';

const loginDoctor = z.object({
    email : z.string().email({message : "Enter valid email address"}),
    password : z.string()
})

const updatePatientDescription = z.object({
    patientId : z.string(),
    condition : z.optional(z.string()),
    description : z.optional(z.string()),
})

const validate = (schema) => (req,res,next)=>{
    const result = schema.safeParse(req.body);
    if(!result){
        const error = result.error.errors.map((err)=> err.message)
        res.status(400).json({error})
    }
    next()
}

export const loginDoctorValidation = validate(loginDoctor);
export const updatePatientDescriptionValidation = validate(updatePatientDescription);
