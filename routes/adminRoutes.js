import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import User from "../models/User.js";
import School from "../models/School.js";

const router = express.Router();

// ✅ Get all school admins (superadmin only)
router.get("/", authMiddleware(["superadmin"]), async (req, res) => {
  try {
    const admins = await User.findAll({
      where: { role: "schooladmin" },
      include: [{ model: School, attributes: ["name"] }],
    });
    res.json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Create new school admin
router.post("/", authMiddleware(["superadmin"]), async (req, res) => {
  try {
    const { username, password, school_id } = req.body;
    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(400).json({ message: "Username already exists" });
    const newAdmin = await User.create({ username, password, role: "schooladmin", school_id });
    res.json({ success: true, data: newAdmin });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Update admin (superadmin only)
router.put("/:id", authMiddleware(["superadmin"]), async (req, res) => {
  try {
    await User.update(req.body, { where: { id: req.params.id } });
    res.json({ success: true, message: "Admin updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Delete admin
router.delete("/:id", authMiddleware(["superadmin"]), async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
