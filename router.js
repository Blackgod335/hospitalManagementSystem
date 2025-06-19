import express from 'express';

import admin from './router/admin.js';
import doctor from './router/doctor.js';
import receptionist from './router/receptionist.js';

const router = express.Router();

router.use('/admin',admin);
router.use('/doctor',doctor);
router.use('/receptionist', receptionist)

export default router
