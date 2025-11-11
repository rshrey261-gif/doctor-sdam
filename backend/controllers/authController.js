// controllers/authController.js
import User from "../models/userModel.js";
import Doctor from "../models/doctorModel.js";
import Patient from "../models/patientModel.js";
import jwt from "jsonwebtoken";

// ✅ Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({ name, email, password, role });

    // ✅ Ensure proper linked profile depending on role
    if (user.role.toLowerCase() === "doctor") {
      let doctor = await Doctor.findOne({ userId: user._id });
      if (!doctor) {
        doctor = await Doctor.create({
          userId: user._id,
          specialization: "",
          qualifications: "",
          experience: 0,
          location: "",
          bio: "",
          availableSlots: [],
        });
      }
    } else if (user.role.toLowerCase() === "patient") {
      let patient = await Patient.findOne({ userId: user._id });
      if (!patient) {
        patient = await Patient.create({
          userId: user._id,
          medicalHistory: [],
          medicalCardId: "",
        });
      }
    }

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ✅ Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 🔄 Ensure linked profile exists after login
    if (user.role.toLowerCase() === "doctor") {
      let doctor = await Doctor.findOne({ userId: user._id });
      if (!doctor) {
        doctor = await Doctor.create({
          userId: user._id,
          specialization: "",
          qualifications: "",
          experience: 0,
          location: "",
          bio: "",
          availableSlots: [],
        });
      }
    } else if (user.role.toLowerCase() === "patient") {
      let patient = await Patient.findOne({ userId: user._id });
      if (!patient) {
        patient = await Patient.create({
          userId: user._id,
          medicalHistory: [],
          medicalCardId: "",
        });
      }
    }

    const token = generateToken(user._id, user.role);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error("Error in loginUser:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ✅ Get User Profile (Protected Route)
export const getProfile = async (req, res) => {
  res.json(req.user);
};
