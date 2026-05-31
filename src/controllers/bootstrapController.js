import About from "../models/About.js";
import Resume from "../models/Resume.js";

/** Single request for hero + nav (reduces cold-start round trips). */
export const getPublicBootstrap = async (req, res) => {
  try {
    const [about, resume] = await Promise.all([
      About.findOne().lean(),
      Resume.findOne().lean(),
    ]);

    return res.json({
      about: about || null,
      resume: resume || null,
    });
  } catch (err) {
    console.error("getPublicBootstrap error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
