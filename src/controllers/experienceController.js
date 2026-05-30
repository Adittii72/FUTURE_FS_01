import Experience from "../models/Experience.js";

export const getAllExperience = async (req, res) => {
  try {
    const experience = await Experience.find().sort({ startDate: -1 });
    return res.json({ experience });
  } catch (err) {
    console.error("getAllExperience error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createExperience = async (req, res) => {
  try {
    const { title, company, location, startDate, endDate, description, isPresent } = req.body;

    if (!title || !company || !startDate) {
      return res.status(400).json({ message: "Title, company, and start date are required" });
    }

    const experience = await Experience.create({
      title,
      company,
      location: location || null,
      startDate,
      endDate: isPresent ? null : endDate || null,
      description: description || null,
      isPresent: isPresent || false,
    });

    return res.status(201).json({ message: "Experience created", experience });
  } catch (err) {
    console.error("createExperience error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, company, location, startDate, endDate, description, isPresent } = req.body;

    const experience = await Experience.findByIdAndUpdate(
      id,
      {
        title,
        company,
        location: location || null,
        startDate,
        endDate: isPresent ? null : endDate || null,
        description: description || null,
        isPresent: isPresent || false,
      },
      { new: true, runValidators: true }
    );

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    return res.json({ message: "Experience updated", experience });
  } catch (err) {
    console.error("updateExperience error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const experience = await Experience.findByIdAndDelete(id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    return res.json({ message: "Experience deleted successfully" });
  } catch (err) {
    console.error("deleteExperience error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
