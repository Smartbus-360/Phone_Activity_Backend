// import express from "express";
// import { Op } from "sequelize";
// import Driver from "../models/Driver.js";
// import PhoneActivity from "../models/PhoneActivity.js";
// import { authMiddleware } from "../middleware/auth.js";

// const router = express.Router();

// // ✅ Get all drivers (superadmin sees all, schooladmin sees own school)
// router.get("/", authMiddleware(["superadmin", "schooladmin"]), async (req, res) => {
//   try {
//     let whereClause = {};
//     if (req.user.role === "schooladmin") {
//       whereClause.school_id = req.user.school_id;
//     }
//     const drivers = await Driver.findAll({
//       where: whereClause,
//       attributes: ["id", "name", "username"]
//     });
//     res.json(drivers);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching drivers", error: err.message });
//   }
// });

// // ✅ Get last 24h activity logs for a driver
// router.get("/:id/activity", authMiddleware(["superadmin", "schooladmin"]), async (req, res) => {
//   try {
//     const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
//     const logs = await PhoneActivity.findAll({
//       where: { DriverId: req.params.id, created_at: { [Op.gte]: since } },
//       order: [["created_at", "DESC"]]
//     });
//     res.json(logs);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching driver activity", error: err.message });
//   }
// });

// export default router;

import express from "express";
import { Op } from "sequelize";
import { authMiddleware } from "../middleware/auth.js";
import Driver from "../models/Driver.js";
import PhoneActivity from "../models/PhoneActivity.js";
import School from "../models/School.js";

const router = express.Router();


router.get("/", authMiddleware(["superadmin", "schooladmin"]), async (req, res) => {
  try {
    let whereClause = {};
    if (req.user.role === "schooladmin") {
      whereClause.school_id = req.user.school_id;
    }

    const drivers = await Driver.findAll({
      where: whereClause,
      include: [{ model: School, attributes: ["name"] }],
      order: [["id", "ASC"]],
    });

    res.json({ success: true, data: drivers });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching drivers", error: err.message });
  }
});


router.post("/register", authMiddleware(["superadmin", "schooladmin"]), async (req, res) => {
  try {
    const { name, username, password, school_id } = req.body;

    if (!username || !password || !name)
      return res.status(400).json({ success: false, message: "Missing fields" });

    // Prevent duplicates
    const existing = await Driver.findOne({ where: { username } });
    if (existing) return res.status(400).json({ success: false, message: "Username already exists" });

    const newDriver = await Driver.create({
      name,
      username,
      password,
      school_id: req.user.role === "schooladmin" ? req.user.school_id : school_id || null,
    });

    res.json({ success: true, data: newDriver });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating driver", error: err.message });
  }
});


router.put("/:id/assign", authMiddleware(["superadmin"]), async (req, res) => {
  try {
    const { school_id } = req.body;
    if (!school_id) return res.status(400).json({ message: "school_id is required" });

    const driver = await Driver.findByPk(req.params.id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    await driver.update({ school_id });
    res.json({ success: true, message: "Driver assigned successfully", data: driver });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error assigning driver", error: err.message });
  }
});


router.get("/:id/activity", authMiddleware(["superadmin", "schooladmin"]), async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id, {
      include: [{ model: School, attributes: ["name"] }],
    });
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    // Restrict access to only same school for schooladmins
    if (req.user.role === "schooladmin" && driver.school_id !== req.user.school_id) {
      return res.status(403).json({ message: "Access denied to this driver" });
    }

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000); // last 24h
    const activity_logs = await PhoneActivity.findAll({
      where: { DriverId: driver.id, created_at: { [Op.gte]: since } },
      order: [["created_at", "DESC"]],
    });

    res.json({
      success: true,
      driver: {
        id: driver.id,
        name: driver.name,
        username: driver.username,
        school: driver.School?.name,
      },
      activity_logs,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching driver activity", error: err.message });
  }
});


router.delete("/:id", authMiddleware(["superadmin"]), async (req, res) => {
  try {
    const deleted = await Driver.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: "Driver not found" });
    res.json({ success: true, message: "Driver deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting driver", error: err.message });
  }
});

export default router;

