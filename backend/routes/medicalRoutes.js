// routes/medicalRoutes.js
import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  generateMedicalCard,
  updateMedicalHistory,
  viewPatientHistory,
} from "../controllers/medicalController.js";

const router = express.Router();

// Patient generates medical card
router.post("/generate-card", protect, generateMedicalCard);

// Patient updates their history
router.post("/update-history", protect, updateMedicalHistory);

// Doctor views a patient's history
router.get("/view/:patientId", protect, viewPatientHistory);

export default router;
