import express from 'express';

import * as doctorController from '../controller/doctor.js';
import upload from '../common/fileManage.js';
import { loginDoctorValidation, updatePatientDescriptionValidation } from '../validation/doctor.js'

const router = express.Router();

router.post('/logindoctor', loginDoctorValidation, (req, res) => {
    doctorController.loginDoctor(req).then((result) => {
        if (result.status == 'NOTFOUND') {
            res.status(401).json({
                message: "Invalid email or password"
            })
        }
        else if (!result) {
            res.status(500).send(result);
        }
        else {
            res.status(200).send(result)

        }
    })
        .catch(err => res.status(500).send({
            message: err.message
        }))
})

router.get('/getpatientdeatils', (req, res) => {
    doctorController.getPatientDetails(req).then((result) => {
        if (!result) {
            res.status(500).send(result)
        }
        else {
            res.status(200).send(result)
        }
    })
        .catch(err => res.status(500).send({
            message: err.message
        }))
})

router.get('/getReport/:fileName', async (req, res) => {
    doctorController.downloadReport(req).then((result) => {
        if(!result){
            res.status(500).send(result)
        }
        else{
            res.sendFile(result.filePath)
        }
    })
        .catch(err => res.status(500).send({
            message: err.message
        }))

});

router.put("/updatedescription", updatePatientDescriptionValidation, (req, res) => {
    doctorController.updatePatientDescription(req).then((result) => {
        if(!result){
            res.status(500).send(result)
        }
        else{
        res.status(200).send(result)
        }
    })
        .catch(err => res.status(500).send({
            message: err.message
        }))
})

router.put('/updateReport/:patientId', upload.single('report'), (req, res) => {
    doctorController.updateReport(req).then((result) => {
        if(!result){
            res.status(500).send(result)
        }
        else{
            res.status(200).send(result)
        }

    })
        .catch(err => res.status(500).send({
            message: err.message
        }))
})

router.put('/updatepatientStatus', (req,res)=>{
    doctorController.patientStatus(req).then((result)=>{
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
export default router