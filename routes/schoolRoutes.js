import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import School from "../models/School.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Get all schools
router.get("/", authMiddleware(["superadmin", "schooladmin"]), async (req, res) => {
  try {
    let whereClause = {};
    if (req.user.role === "schooladmin") {
      whereClause.id = req.user.school_id;
    }
    const schools = await School.findAll({ where: whereClause });
    res.json({ success: true, data: schools });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Create new school
router.post("/", authMiddleware(["superadmin"]), async (req, res) => {
  try {
    const school = await School.create(req.body);
    res.json({ success: true, data: school });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Update school
router.put("/:id", authMiddleware(["superadmin"]), async (req, res) => {
  try {
    await School.update(req.body, { where: { id: req.params.id } });
    res.json({ success: true, message: "School updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Delete school
router.delete("/:id", authMiddleware(["superadmin"]), async (req, res) => {
  try {
    await School.destroy({ where: { id: req.params.id } });
    res.json({ success: true, message: "School deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
