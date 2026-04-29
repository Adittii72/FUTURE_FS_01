import supabase from "../config/supabase.js";
import { uploadToSupabase } from "../utils/storage.js";


export const getAbout = async (req, res) => {
  try {
    const { data: aboutArray, error } = await supabase
      .from("about")
      .select("*");

    if (error) throw error;

    const about = aboutArray && aboutArray.length > 0 ? aboutArray[0] : null;
    if (!about) return res.status(404).json({ message: "About information not found" });
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

    const { name, headline, bio, linkedin, github, location, coverImageUrl, profileImageUrl } = req.body;

    // Get existing about or create new
    const { data: aboutArray } = await supabase
      .from("about")
      .select("*");

    let about = aboutArray && aboutArray.length > 0 ? aboutArray[0] : null;

    if (!about) {
      const { data: newAbout, error: createError } = await supabase
        .from("about")
        .insert([{
          name: name || "Your Name",
          headline: headline || null,
          bio: bio || null,
          linkedin: linkedin || null,
          github: github || null,
          location: location || null,
          coverImageUrl: coverImageUrl || null,
          profileImageUrl: profileImageUrl || null,
        }])
        .select()
        .single();

      if (createError) throw createError;
      return res.status(201).json({ message: "About created", about: newAbout });
    }

    // Update existing
    const updateData = {};
    if ('name' in req.body) updateData.name = name;
    if ('headline' in req.body) updateData.headline = headline;
    if ('bio' in req.body) updateData.bio = bio;
    if ('linkedin' in req.body) updateData.linkedin = linkedin;
    if ('github' in req.body) updateData.github = github;
    if ('location' in req.body) updateData.location = location;
    if ('coverImageUrl' in req.body) updateData.coverImageUrl = coverImageUrl;
    if ('profileImageUrl' in req.body) updateData.profileImageUrl = profileImageUrl;

    const { data: updatedAbout, error: updateError } = await supabase
      .from("about")
      .update(updateData)
      .eq("id", about.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return res.json({ message: "About updated", about: updatedAbout });
  } catch (err) {
    console.error("updateAbout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// @route   POST /api/about/upload
// @access  Private (Admin)
export const uploadAboutImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Supabase Storage
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "media";
    const ext = req.file.originalname.split(".").pop() || "jpg";
    const filePath = `about/cover-${Date.now()}.${ext}`;

    const publicUrl = await uploadToSupabase({
      bucket,
      path: filePath,
      fileBuffer: req.file.buffer,
      contentType: req.file.mimetype,
    });

    // Get existing about
    const { data: aboutArray } = await supabase
      .from("about")
      .select("*");

    let about = aboutArray && aboutArray.length > 0 ? aboutArray[0] : null;

    if (about) {
      const { data: updated, error } = await supabase
        .from("about")
        .update({ coverImageUrl: publicUrl })
        .eq("id", about.id)
        .select()
        .single();

      if (error) throw error;
      return res.json({ message: "About image updated", about: updated });
    } else {
      const { data: created, error } = await supabase
        .from("about")
        .insert([{ coverImageUrl: publicUrl }])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json({ message: "About image created", about: created });
    }
  } catch (err) {
    console.error("uploadAboutImage error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};