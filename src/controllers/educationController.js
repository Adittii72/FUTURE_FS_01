import Education from "../models/Education.js";

export const getAllEducation = async (req, res) => {
  try {
    const education = await Education.find().sort({ startDate: -1 });
    return res.json({ education });
  } catch (err) {
    console.error("getAllEducation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createEducation = async (req, res) => {
  try {
    const { degree, institution, location, startDate, endDate, description, isPresent } = req.body;

    if (!degree || !institution || !startDate) {
      return res.status(400).json({ message: "Degree, institution, and start date are required" });
    }

    const education = await Education.create({
      degree,
      institution,
      location: location || null,
      startDate,
      endDate: isPresent ? null : endDate || null,
      description: description || null,
      isPresent: isPresent || false,
    });

    return res.status(201).json({ message: "Education created", education });
  } catch (err) {
    console.error("createEducation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const { degree, institution, location, startDate, endDate, description, isPresent } = req.body;

    const education = await Education.findByIdAndUpdate(
      id,
      {
        degree,
        institution,
        location: location || null,
        startDate,
        endDate: isPresent ? null : endDate || null,
        description: description || null,
        isPresent: isPresent || false,
      },
      { new: true, runValidators: true }
    );

    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    return res.json({ message: "Education updated", education });
  } catch (err) {
    console.error("updateEducation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const education = await Education.findByIdAndDelete(id);

    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    return res.json({ message: "Education deleted successfully" });
  } catch (err) {
    console.error("deleteEducation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
