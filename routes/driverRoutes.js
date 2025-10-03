import express from "express";
import { Op } from "sequelize";
import Driver from "../models/Driver.js";
import PhoneActivity from "../models/PhoneActivity.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// ✅ Get all drivers (superadmin sees all, schooladmin sees own school)
router.get("/", authMiddleware(["superadmin", "schooladmin"]), async (req, res) => {
  try {
    let whereClause = {};
    if (req.user.role === "schooladmin") {
      whereClause.school_id = req.user.school_id;
    }
    const drivers = await Driver.findAll({
      where: whereClause,
      attributes: ["id", "name", "username"]
    });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching drivers", error: err.message });
  }
});

// ✅ Get last 24h activity logs for a driver
router.get("/:id/activity", authMiddleware(["superadmin", "schooladmin"]), async (req, res) => {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const logs = await PhoneActivity.findAll({
      where: { DriverId: req.params.id, created_at: { [Op.gte]: since } },
      order: [["created_at", "DESC"]]
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching driver activity", error: err.message });
  }
});

export default router;
