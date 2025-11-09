// routes/adminRoutes.js
import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  getAllAppointments,
  deleteUser,
  getDashboardStats,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", protect, getAllUsers);
router.get("/appointments", protect, getAllAppointments);
router.delete("/user/:id", protect, deleteUser);
router.get("/stats", protect, getDashboardStats);

export default router;
