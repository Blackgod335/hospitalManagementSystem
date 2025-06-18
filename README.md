# 🏥 Hospital Management System API

A RESTful API built using **Node.js**, **Express**, and **MongoDB** to manage hospital operations such as admin, doctor, receptionist, patient, and appointment workflows. It includes JWT authentication, file uploads, Twilio-based SMS notifications, and validation via Zod.

---

## 🚀 Features

- **Admin**:
  - Register/Login
  - Manage doctors & receptionists (CRUD)
  - View all patients

- **Doctor**:
  - Login
  - View patient details
  - Update patient descriptions
  - Upload reports
  - Update appointment status

- **Receptionist**:
  - Login
  - Register/update patient information
  - Schedule/manage appointments
  - Upload reports
  - View doctor & patient data

- **Authentication**:
  - Role-based JWT authentication and route protection

- **File Upload**:
  - Upload and download patient reports

- **Notifications**:
  - Appointment reminders via Twilio SMS (with cron job)

- **Validation**:
  - Zod for request payload validation

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB (via Mongoose)
- **Validation**: Zod
- **Authentication**: JWT
- **Notifications**: Twilio API
- **File Handling**: Multer

---

### ✅ Prerequisites

- Node.js (v16+)
- MongoDB (Local or Atlas)
- Twilio Account (for SMS)
