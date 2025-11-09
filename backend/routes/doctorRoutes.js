// routes/doctorRoutes.js
import express from "express";
import protect from "../middleware/authMiddleware.js";
import { registerDoctor, getDoctorProfile } from "../controllers/doctorController.js";

const router = express.Router();

router.post("/register", protect, registerDoctor);
router.get("/profile", protect, getDoctorProfile);

export default router;
