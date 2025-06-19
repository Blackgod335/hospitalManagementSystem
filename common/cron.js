import { CronJob } from "cron";
import appoinmentModel from '../model/appoinment.js';
import createMessage from "./twilio.js";

const getData = async () => {
    try {
        return await appoinmentModel.aggregate([
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient'
                }
            },
            { $unwind: '$patient' },
            {
                $project: {
                    _id: 0,
                    date: "$appointment.date",
                    name: "$patient.name",
                    mobile: "$patient.mobile",
                }
            },
        ]);
    }
    catch (err) {
        return {
            message: err.message
        }
    }
}

const sendMessage = async () => {
    try {
        const getAppointment = await getData();
        getAppointment.forEach((item) => {
            const date = new Date(item.date);
            const current = new Date()
            const appointmentDate = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}T${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;
            const currentTime = `${current.getUTCFullYear()}-${String(current.getUTCMonth() + 1).padStart(2, '0')}-${String(current.getUTCDate()).padStart(2, '0')}T${String(current.getHours()).padStart(2, '0')}:${String(current.getMinutes()).padStart(2, '0')}`;
            if (appointmentDate == currentTime) {
                console.log("send Message", item.mobile)
                createMessage(item.name, item.date, item.mobile)
            }
        });
    } catch (error) {
        console.error("Failed to send messages:", error);
    }
};

new CronJob("* * * * *", sendMessage).start();