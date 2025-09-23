import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import PhoneActivity from "./models/PhoneActivity.js";
import cron from "node-cron";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import { authMiddleware } from "./middleware/auth.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

app.use(cors());
app.use(express.json());

// 🔹 Test DB connection
sequelize.authenticate()
  .then(() => console.log("✅ MySQL connected successfully"))
  .catch(err => console.error("❌ DB Connection Error: ", err));

// 🔹 API: Save phone activity
// app.post("/api/activity", async (req, res) => {
//   try {
//     const { device_id, activity } = req.body;
//     const log = await PhoneActivity.create({ device_id, activity });
//     res.json({ success: true, data: log });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // 🔹 API: Fetch all activities
// app.get("/api/activity", async (req, res) => {
//   try {
//     const logs = await PhoneActivity.findAll({ order: [["created_at", "DESC"]] });
//     res.json({ success: true, data: logs });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// 🔹 API: Save phone activity
app.post("/api/activity", async (req, res) => {
  try {
    const { device_id, battery, screen_state, foreground_app, data_usage_mb } = req.body;

    const log = await PhoneActivity.create({
      device_id,
      battery,
      screen_state,
      foreground_app,
      data_usage_mb
    });

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

// 🔹 API: Manual cleanup of old logs
app.delete("/api/activity/cleanup", async (req, res) => {
  try {
    const deleted = await PhoneActivity.destroy({
      where: {
        created_at: {
          [Op.lt]: new Date(Date.now() - 24 * 60 * 60 * 1000) // older than 1 day
        }
      }
    });
    res.json({ success: true, message: `🧹 Deleted ${deleted} old logs` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password, role, school_id } = req.body;
    const user = await User.create({ username, password, role, school_id });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔹 Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

if (password !== user.password) {
  return res.status(401).json({ success: false, message: "Invalid credentials" });
}

    const token = jwt.sign(
      { id: user.id, role: user.role, school_id: user.school_id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ success: true, token, user: { id: user.id, username: user.username, role: user.role, school_id: user.school_id } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/activity", authMiddleware, async (req, res) => {
  try {
    let whereClause = {};

    if (req.user.role !== "superadmin") {
      // Only logs for that school
      whereClause = { "$Driver.school_id$": req.user.school_id };
    }

    const logs = await PhoneActivity.findAll({
      include: [{ model: Driver, attributes: ["name", "school_id"] }],
      where: whereClause,
      order: [["created_at", "DESC"]]
    });

    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});



app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
cron.schedule("0 0 * * *", async () => {
  try {
    const deleted = await PhoneActivity.destroy({
      where: {
        created_at: {
          [Op.lt]: new Date(Date.now() - 24 * 60 * 60 * 1000) // older than 1 day
        }
      }
    });
    console.log(`🧹 Cleaned up ${deleted} old activity logs`);
  } catch (err) {
    console.error("Cleanup error:", err);
  }
});

