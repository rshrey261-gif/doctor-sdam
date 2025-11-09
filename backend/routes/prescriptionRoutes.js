// routes/prescriptionRoutes.js
import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createPrescription,
  getPatientPrescriptions,
} from "../controllers/prescriptionController.js";

const router = express.Router();

router.post("/create", protect, createPrescription);  // Doctor only
router.get("/my", protect, getPatientPrescriptions);  // Patient only

export default router;
