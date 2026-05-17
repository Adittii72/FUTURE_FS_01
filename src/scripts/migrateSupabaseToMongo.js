import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDatabase from "../config/database.js";
import supabase from "../config/supabase.js";
import About from "../models/About.js";
import Achievement from "../models/Achievement.js";
import Admin from "../models/Admin.js";
import ContactMessage from "../models/ContactMessage.js";
import Project from "../models/Project.js";
import Resume from "../models/Resume.js";
import Skill from "../models/Skill.js";

dotenv.config();

const fetchTable = async (tableName) => {
  const { data, error } = await supabase.from(tableName).select("*");
  if (error) throw error;
  return data || [];
};

const migrate = async () => {
  try {
    await connectDatabase();

    const [
      aboutRows,
      achievementRows,
      adminRows,
      contactRows,
      projectRows,
      projectImageRows,
      resumeRows,
      skillRows,
    ] = await Promise.all([
      fetchTable("about"),
      fetchTable("achievements"),
      fetchTable("admins"),
      fetchTable("contact_messages"),
      fetchTable("projects"),
      fetchTable("project_images"),
      fetchTable("resumes"),
      fetchTable("skills"),
    ]);

    await Promise.all([
      About.deleteMany({}),
      Achievement.deleteMany({}),
      Admin.deleteMany({}),
      ContactMessage.deleteMany({}),
      Project.deleteMany({}),
      Resume.deleteMany({}),
      Skill.deleteMany({}),
    ]);

    if (aboutRows[0]) await About.create(aboutRows[0]);
    if (resumeRows[0]) await Resume.create(resumeRows[0]);
    if (achievementRows.length) await Achievement.insertMany(achievementRows);
    if (skillRows.length) await Skill.insertMany(skillRows);
    if (contactRows.length) await ContactMessage.insertMany(contactRows);

    if (adminRows.length) {
      await Admin.insertMany(
        adminRows.map((admin) => ({
          name: admin.name,
          email: admin.email,
          passwordHash: admin.passwordHash || admin.password,
          isActive: admin.isActive ?? true,
          role: admin.role || "admin",
        }))
      );
    }

    if (projectRows.length) {
      await Project.insertMany(
        projectRows.map((project) => ({
          title: project.title,
          description: project.description,
          techStack: project.techStack || null,
          githubUrl: project.githubUrl || null,
          videoUrl: project.videoUrl || null,
          images: projectImageRows
            .filter((image) => String(image.projectId) === String(project.id))
            .map((image) => ({ imageUrl: image.imageUrl })),
        }))
      );
    }

    console.log("Migration complete.");
    console.log(`About rows: ${aboutRows.length}`);
    console.log(`Achievements: ${achievementRows.length}`);
    console.log(`Admins: ${adminRows.length}`);
    console.log(`Contact messages: ${contactRows.length}`);
    console.log(`Projects: ${projectRows.length}`);
    console.log(`Resumes: ${resumeRows.length}`);
    console.log(`Skills: ${skillRows.length}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

migrate();
