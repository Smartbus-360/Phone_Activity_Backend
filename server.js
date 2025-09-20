import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import PhoneActivity from "./models/PhoneActivity.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 🔹 Test DB connection
sequelize.authenticate()
  .then(() => console.log("✅ MySQL connected successfully"))
  .catch(err => console.error("❌ DB Connection Error: ", err));

// 🔹 API: Save phone activity
app.post("/api/activity", async (req, res) => {
  try {
    const { device_id, activity } = req.body;
    const log = await PhoneActivity.create({ device_id, activity });
    res.json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔹 API: Fetch all activities
app.get("/api/activity", async (req, res) => {
  try {
    const logs = await PhoneActivity.findAll({ order: [["created_at", "DESC"]] });
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
