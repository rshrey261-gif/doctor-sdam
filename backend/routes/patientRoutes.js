// routes/patientRoutes.js
import express from "express";
import protect from "../middleware/authMiddleware.js";
import { registerPatient, getPatientProfile } from "../controllers/patientController.js";

const router = express.Router();

router.post("/register", protect, registerPatient);
router.get("/profile", protect, getPatientProfile);

export default router;
