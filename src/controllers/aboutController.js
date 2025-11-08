import About from "../models/About.js";


export const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) return res.status(404).json({ message: "About information not found" });
    return res.json({ about });
  } catch (err) {
    console.error("getAbout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const updateAbout = async (req, res) => {
  try {
    const { headline, bio, linkedin, github, location, coverImageUrl } = req.body;

    if (!headline && !bio && !linkedin && !github && !location && !coverImageUrl) {
      return res.status(400).json({ message: "At least one field is required to update" });
    }


    let about = await About.findOne();

    if (!about) {

      about = await About.create({
        headline: headline || "",
        bio: bio || "",
        linkedin: linkedin || null,
        github: github || null,
        location: location || null,
        coverImageUrl: coverImageUrl || null,
      });
      return res.status(201).json({ message: "About created", about });
    }


    await about.update({
      headline: headline ?? about.headline,
      bio: bio ?? about.bio,
      linkedin: linkedin ?? about.linkedin,
      github: github ?? about.github,
      location: location ?? about.location,
      coverImageUrl: coverImageUrl ?? about.coverImageUrl,
    });

    return res.json({ message: "About updated", about });
  } catch (err) {
    console.error("updateAbout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
