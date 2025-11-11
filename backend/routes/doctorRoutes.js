// routes/doctorRoutes.js
import express from "express";
import protect from "../middleware/authMiddleware.js";
import { verifyDoctor } from "../middleware/authMiddleware.js";
import { registerDoctor, getDoctorProfile, addSlot, getSlots } from "../controllers/doctorController.js";

const router = express.Router();

router.post("/register", protect, registerDoctor);
router.get("/profile", protect, getDoctorProfile);
router.post("/slots", protect, verifyDoctor, addSlot);
router.get("/slots", protect, verifyDoctor, getSlots);

export default router;
