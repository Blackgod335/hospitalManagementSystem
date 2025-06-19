import express from 'express';

import * as adminController from '../controller/admin.js';
import * as adminValidation from '../validation/admin.js'

const router = express.Router();

router.post('/registeradmin', adminValidation.registerAdminValidation, (req, res) => {
    adminController.registerAdmin(req).then((result) => {
        if (!result) {
            res.status(400).send(result);
        }
        else {
            res.status(201).send(result)
        }
    })
        .catch(err => res.status(500).send({
            message: err.message
        }))
})
router.post('/loginadmin', adminValidation.logInAdminValidation, async (req, res) => {
    try {
        const result = await adminController.logInAdmin(req);
        if (result.status === "NOTFOUND") {
            res.status(401).json({ message: "Invalid email or password" });
        }

        if (!result) {
            return res.status(500).send(result);
        }

        return res.status(200).json(result);

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.post('/createdoctor', adminValidation.createDoctorValidation, (req, res) => {
    adminController.createDoctor(req).then((result) => {
        if (!result) {
            res.status(500).send(result);
            return;
        }
        res.status(201).send(result)
    })
        .catch(err => res.status(500).send({
            message: err.message
        }))
})

router.get('/getDoctor', (req, res) => {
    adminController.getDoctor(req).then((result) => {
        if (!result) {
            res.status(500).send(result);
            return;
        }
        res.status(200).send(result);
    })
        .catch(err => res.status(500).send({
            message: err.message
        }))
})

router.put('/updatedoctor', adminValidation.updateDoctorValidation, (req, res) => {
    adminController.updateDoctor(req).then((result) => {
        if (!result) {
            res.status(500).send(result);
            return;
        }
        res.status(200).send(result);
    })
        .catch(err => res.status(500).send({
            message: err.message
        }))
})

router.delete('/deletedoctor/:doctorId', (req, res) => {
    adminController.deleteDoctor(req).then((result) => {
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

router.post('/createreceptionist', adminValidation.createReceptionistValidation, (req, res) => {
    adminController.createReceptionist(req).then((result) => {
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

router.get('/getreceptionist', (req, res) => {
    adminController.getAllRecptionist(req).then((result) => {
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

router.put('/updaterecptionist', adminValidation.updateRecptionistValidation, (req, res) => {
    adminController.updateRecptionist(req).then((result) => {
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

router.delete('/deleterecptionist/:receptionistId', (req, res) => {
    adminController.deleteRecptionist(req).then((result) => {
        if (!result) {
            res.status(500).send(result)
        }
        else {
            res.status(200).send(result)
        }
    })
        .catch(err => res.status(500).send({
            messate: err.message
        }))
})

router.get('/getallPatient', (req, res) => {
    adminController.getAllPatient(req).then((result) => {
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

export default router