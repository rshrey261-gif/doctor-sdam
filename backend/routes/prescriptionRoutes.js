// routes/prescriptionRoutes.js
import express from "express";
import protect, { verifyDoctor } from "../middleware/authMiddleware.js";
import { createPrescription,
  getPatientPrescriptions } from "../controllers/prescriptionController.js";

const router = express.Router();

// Doctor creates prescription
router.post("/", protect, verifyDoctor, createPrescription);
router.get("/my", protect, getPatientPrescriptions); // ✅ Add this line


export default router;
