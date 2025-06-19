import express from 'express';

import * as receptionistController from '../controller/receptionist.js';
import upload from '../common/fileManage.js';
import * as receptionistValidation from '../validation/receptionist.js'


const router = express.Router();

router.post('/loginreceptionist', receptionistValidation.loginReceptionistValidation,(req,res)=>{
    receptionistController.loginReceptionist(req).then((result)=>{
        if(result.status == 'NOTFOUND'){
            res.status(401).json({
                message : "Invalid email or password"
            })
        }
        else if(!result){
            res.status(500).send(result)
        }
        else{
        res.status(200).send(result)
        }
    })
    .catch(err => res.status(500).send({
        message : err.message
    }))
})

router.post('/createpatient',receptionistValidation.createPatientValidation,(req,res)=>{
    receptionistController.createPatient(req).then((result)=>{
        if(!result){
            res.status(500).send(result)
        }
        else{
        res.status(200).send(result)
        }
    })
    .catch(err => res.status(500).send({
        message : err.message
    }))
})

router.get('/getPatientList',(req,res)=>{
    receptionistController.getPatientList(req).then((result)=>{
        if(!result){
            res.status(500).send(result)
        }
        else{
        res.status(200).send(result)
        }    })
    .catch(err => res.status(500).send({
        message : err.message
    }))
})

router.put('/updatePatient', receptionistValidation.updatePatientValidation,(req,res)=>{
    receptionistController.updatePatient(req).then((result)=>{
        if(!result){
            res.status(500).send(result)
        }
        else{
        res.status(200).send(result)
        }    })
    .catch(err => res.status(500).send({
        message : err.message
    }))
})

router.get('/getdoctor',(req,res)=>{
    receptionistController.getDoctor(req).then((result)=>{
        if(!result){
            res.status(500).send(result)
        }
        else{
        res.status(200).send(result)
        }    })
    .catch(err => res.status(500).send({
        message : err.message
    }))
})

router.post('/createappointment',receptionistValidation.createAppointmentValidation,(req,res)=>{
    receptionistController.createAppointment(req).then((result)=>{
        if(result.status == 'DUPLICATE'){
            res.status(406).send(result.message)
        }
        else if(result.status == "LIMITREACH"){
            res.status(406).send(result.message)
        }
        else if(!result){
            res.status(500).send(result)
        }
        else{
        res.status(200).send(result)
        }    })
    .catch(err => res.status(500).send({
        message : err.message
    }))
})

router.get('/showAppoinment', (req,res)=>{
    receptionistController.showAppoinment(req).then((result)=>{
        if(!result){
            res.status(500).send(result)
        }
        else{
        res.status(200).send(result)
        }    })
    .catch(err => res.status(500).send({
        message : err.message
    }))
})

router.put('/updateAppointment',receptionistValidation.updateAppointmentValidation, (req,res)=>{
    receptionistController.updateAppointment(req).then((result)=>{
        if(!result){
            res.status(500).send(result)
        }
        else{
        res.status(200).send(result)
        }    })
    .catch(err => res.status(500).send({
        message : err.message
    }))
})

router.put('/uploadReport',upload.single("report"),(req,res)=>{
    receptionistController.uploadReport(req).then((result)=>{
        if(!result){
            res.status(500).send(result)
        }
        else{
        res.status(200).send(result)
        }    })
    .catch(err => res.status(500).send({
        message : err.message
    }))
})

export default router;