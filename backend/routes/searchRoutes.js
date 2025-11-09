// routes/searchRoutes.js
import express from "express";
import { searchDoctors } from "../controllers/searchController.js";

const router = express.Router();

// Public search route
router.get("/search", searchDoctors);

export default router;
