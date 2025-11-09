// routes/reviewRoutes.js
import express from "express";
import protect from "../middleware/authMiddleware.js";
import { addReview, getDoctorReviews } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", protect, addReview);
router.get("/:doctorId", getDoctorReviews);

export default router;
