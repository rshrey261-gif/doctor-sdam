// routes/appointmentRoutes.js
import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  bookAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";

const router = express.Router();

// Patient books appointment
router.post("/book", protect, bookAppointment);

// Doctor views appointments
router.get("/doctor", protect, getDoctorAppointments);

// Patient views appointments
router.get("/patient", protect, getPatientAppointments);

// Doctor updates status
router.put("/status", protect, updateAppointmentStatus);

export default router;
