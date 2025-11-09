// controllers/searchController.js
import Doctor from "../models/doctorModel.js";
import User from "../models/userModel.js";

// @desc  Search or list doctors
// @route GET /api/doctors/search
// @access Public
export const searchDoctors = async (req, res) => {
  try {
    const { specialty, location, name, sortBy, page = 1, limit = 10 } = req.query;

    const query = {};

    if (specialty) query.specialization = { $regex: specialty, $options: "i" };
    if (location) query.location = { $regex: location, $options: "i" };

    // match by doctor name (via user collection)
    let doctors = await Doctor.find(query)
      .populate("userId", "name email")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    if (name) {
      doctors = doctors.filter((d) =>
        d.userId.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    // sort logic
    if (sortBy === "rating") {
      doctors.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "experience") {
      doctors.sort((a, b) => b.experience - a.experience);
    }

    const total = await Doctor.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      results: doctors,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
