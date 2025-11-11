// routes/notificationRoutes.js
import express from "express";
import protect, { verifyDoctor } from "../middleware/authMiddleware.js";
import Doctor from "../models/doctorModel.js";
import Patient from "../models/patientModel.js";

const router = express.Router();

/**
 * ✅ GET notifications
 * Doctors → from their notifications array
 * Patients → optional (if you add later)
 */
router.get("/", protect, async (req, res) => {
  try {
    let notifications = [];

    if (req.user.role?.toLowerCase() === "doctor") {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      notifications = doctor?.notifications || [];
    } else if (req.user.role?.toLowerCase() === "patient") {
      const patient = await Patient.findOne({ userId: req.user._id });
      notifications = patient?.notifications || [];
    }

    res.json(notifications.reverse());
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

/**
 * ✅ Mark notification as read (doctor only)
 */
router.put("/read/:id", protect, verifyDoctor, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const note = doctor.notifications.id(req.params.id);
    if (!note) return res.status(404).json({ message: "Notification not found" });

    note.read = true;
    await doctor.save();

    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("Error marking notification read:", err);
    res.status(500).json({ message: "Error updating notification" });
  }
});

export default router;
