// controllers/doctorController.js
import Doctor from "../models/doctorModel.js";
import User from "../models/userModel.js";

// @desc  Register or update doctor profile
// @route POST /api/doctors/register
// @access Private (doctor)
export const registerDoctor = async (req, res) => {
  try {
    const { specialization, qualifications, experience, bio, location } = req.body;

    const user = await User.findById(req.user._id);
    if (!user || user.role !== "doctor") {
      return res.status(403).json({ message: "Not authorized as doctor" });
    }

    let doctor = await Doctor.findOne({ userId: req.user._id });

    if (doctor) {
      // update existing
      doctor.specialization = specialization || doctor.specialization;
      doctor.qualifications = qualifications || doctor.qualifications;
      doctor.experience = experience || doctor.experience;
      doctor.bio = bio || doctor.bio;
      doctor.location = location || doctor.location;
      await doctor.save();
      res.json({ message: "Doctor profile updated", doctor });
    } else {
      // create new
      doctor = await Doctor.create({
        userId: req.user._id,
        specialization,
        qualifications,
        experience,
        bio,
        location,
      });
      res.status(201).json({ message: "Doctor profile created", doctor });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get doctor profile
// @route GET /api/doctors/profile
// @access Private (doctor)
export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
