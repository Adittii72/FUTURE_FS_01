import About from "../models/About.js";
import { uploadToSupabase } from "../utils/storage.js";

export const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({ message: "About information not found" });
    }

    return res.json({ about });
  } catch (err) {
    console.error("getAbout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateAbout = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "At least one field is required to update" });
    }

    const fields = [
      "name",
      "headline",
      "bio",
      "linkedin",
      "github",
      "location",
      "coverImageUrl",
      "profileImageUrl",
    ];

    const updateData = {};
    for (const field of fields) {
      if (field in req.body) updateData[field] = req.body[field];
    }

    let about = await About.findOne();
    let message = "About updated";
    let status = 200;

    if (!about) {
      about = await About.create({
        name: updateData.name || "Your Name",
        headline: updateData.headline || null,
        bio: updateData.bio || null,
        linkedin: updateData.linkedin || null,
        github: updateData.github || null,
        location: updateData.location || null,
        coverImageUrl: updateData.coverImageUrl || null,
        profileImageUrl: updateData.profileImageUrl || null,
      });
      message = "About created";
      status = 201;
    } else {
      about.set(updateData);
      await about.save();
    }

    return res.status(status).json({ message, about });
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

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "media";
    const ext = req.file.originalname.split(".").pop() || "jpg";
    const filePath = `about/cover-${Date.now()}.${ext}`;

    const publicUrl = await uploadToSupabase({
      bucket,
      path: filePath,
      fileBuffer: req.file.buffer,
      contentType: req.file.mimetype,
    });

    let about = await About.findOne();
    let status = 200;
    let message = "About image updated";

    if (!about) {
      about = await About.create({ coverImageUrl: publicUrl });
      status = 201;
      message = "About image created";
    } else {
      about.coverImageUrl = publicUrl;
      await about.save();
    }

    return res.status(status).json({ message, about });
  } catch (err) {
    console.error("uploadAboutImage error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};
