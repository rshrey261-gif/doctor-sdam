// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import medicalRoutes from "./routes/medicalRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";



dotenv.config();

const app = express();

// MongoDB connection
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", searchRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/medical", medicalRoutes);
app.use("/api/admin", adminRoutes);



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve prescriptions folder publicly
app.use("/prescriptions", express.static(path.join(__dirname, "prescriptions")));

// Routes
app.use("/api/prescriptions", prescriptionRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
