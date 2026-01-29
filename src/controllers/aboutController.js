import About from "../models/About.js";

export const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({ message: "About information not found" });
    }
    return res.json(about);
  } catch (err) {
    console.error("getAbout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateAbout = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ message: "At least one field is required to update" });
    }

    const {
      name,
      headline,
      bio,
      linkedin,
      github,
      location,
      coverImageUrl,
      profileImageUrl,
    } = req.body;

    let about = await About.findOne();

    if (!about) {
      about = await About.create({
        name: name || "Your Name",
        headline: headline || "",
        bio: bio || "",
        linkedin: linkedin || null,
        github: github || null,
        location: location || null,
        coverImageUrl: coverImageUrl || null,
        profileImageUrl: profileImageUrl || null,
      });
      return res.status(201).json(about);
    }

    await about.update({
      name: "name" in req.body ? name : about.name,
      headline: "headline" in req.body ? headline : about.headline,
      bio: "bio" in req.body ? bio : about.bio,
      linkedin: "linkedin" in req.body ? linkedin : about.linkedin,
      github: "github" in req.body ? github : about.github,
      location: "location" in req.body ? location : about.location,
      coverImageUrl:
        "coverImageUrl" in req.body ? coverImageUrl : about.coverImageUrl,
      profileImageUrl:
        "profileImageUrl" in req.body
          ? profileImageUrl
          : about.profileImageUrl,
    });

    return res.json(about);
  } catch (err) {
    console.error("updateAbout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const uploadAboutImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    let about = await About.findOne();

    if (about) {
      await about.update({ coverImageUrl: fileUrl });
      return res.json(about);
    } else {
      about = await About.create({ coverImageUrl: fileUrl });
      return res.status(201).json(about);
    }
  } catch (err) {
    console.error("uploadAboutImage error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
