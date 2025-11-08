import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import { syncDb } from "./models/index.js";
import adminRoutes from "./routes/adminRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/admin", adminRoutes);
app.use("/api/about", aboutRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});


sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL Database connected successfully!");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
