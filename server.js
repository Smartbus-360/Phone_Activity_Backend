// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import sequelize from "./config/db.js";
// import PhoneActivity from "./models/PhoneActivity.js";
// import cron from "node-cron";
// import { Op } from "sequelize";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import User from "./models/User.js";
// import { authMiddleware } from "./middleware/auth.js";
// import Driver from "./models/Driver.js";
// import School from "./models/School.js";
// import DriverLoginLog from "./models/DriverLoginLog.js";

// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 5000;
// const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// app.use(cors());
// app.use(express.json());

// // 🔹 Test DB connection
// sequelize.authenticate()
//   .then(() => console.log("✅ MySQL connected successfully"))
//   .catch(err => console.error("❌ DB Connection Error: ", err));

// // 🔹 API: Save phone activity
// // app.post("/api/activity", async (req, res) => {
// //   try {
// //     const { device_id, activity } = req.body;
// //     const log = await PhoneActivity.create({ device_id, activity });
// //     res.json({ success: true, data: log });
// //   } catch (error) {
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // });

// // // 🔹 API: Fetch all activities
// // app.get("/api/activity", async (req, res) => {
// //   try {
// //     const logs = await PhoneActivity.findAll({ order: [["created_at", "DESC"]] });
// //     res.json({ success: true, data: logs });
// //   } catch (error) {
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // });

// // 🔹 API: Save phone activity
// // app.post("/api/activity", async (req, res) => {
// //   try {
// //     const { device_id, battery, screen_state, foreground_app, data_usage_mb } = req.body;

// //     // ✅ Check if driver already exists
// //     let driver = await Driver.findOne({ where: { device_id } });

// //     if (!driver) {
// //       // Auto-register new driver as "unassigned"
// //       driver = await Driver.create({
// //         name: "Unassigned Driver",
// //         device_id,
// //         school_id: null  // not yet linked
// //       });
// //     }

// //     // ✅ Save phone activity and link it with driver
// //     const log = await PhoneActivity.create({
// //       device_id,
// //       battery,
// //       screen_state,
// //       foreground_app,
// //       data_usage_mb,
// //       DriverId: driver.id   // associate with driver
// //     });

// //     res.json({ success: true, data: log });
// //   } catch (error) {
// //     console.error("Error saving activity:", error);
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // });

// // Create School (only superadmin)
// // app.post("/api/schools/create", authMiddleware, async (req, res) => {
// //   try {
// //     if (req.user.role !== "superadmin") {
// //       return res.status(403).json({ success: false, message: "Not authorized" });
// //     }

// //     const { name } = req.body;
// //     if (!name) {
// //       return res.status(400).json({ success: false, message: "School name required" });
// //     }

// //     const school = await School.create({ name });
// //     res.json({ success: true, data: school });
// //   } catch (error) {
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // });



// // 🔹 API: Fetch all activities
// // app.get("/api/activity", async (req, res) => {
// //   try {
// //     const logs = await PhoneActivity.findAll({ order: [["created_at", "DESC"]] });
// //     res.json({ success: true, data: logs });
// //   } catch (error) {
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // });
// // app.get("/api/schools", async (req, res) => {
// //   try {
// //     const schools = await School.findAll({
// //       attributes: ["id", "name"], // only return needed fields
// //       order: [["name", "ASC"]]
// //     });
// //     res.json({ success: true, data: schools });
// //   } catch (error) {
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // });

// // 🔹 API: Save phone activity (driver must be logged in)
// app.post("/api/activity", async (req, res) => {
//   try {
//     const { device_id, battery, screen_state, foreground_app, data_usage_mb } = req.body;

//     // ✅ Find driver by device_id
//     const driver = await Driver.findOne({ where: { device_id } });

//     if (!driver) {
//       return res.status(401).json({ success: false, message: "Driver not logged in" });
//     }

//     // ✅ Save phone activity and link it with driver
//     const log = await PhoneActivity.create({
//       device_id,
//       battery,
//       screen_state,
//       foreground_app,
//       data_usage_mb,
//       DriverId: driver.id
//     });

//     res.json({ success: true, data: log });
//   } catch (error) {
//     console.error("Error saving activity:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Create driver (only admin/superadmin)
// app.post("/api/drivers/register", authMiddleware, async (req, res) => {
//   try {
//     if (!["superadmin", "schooladmin"].includes(req.user.role)) {
//       return res.status(403).json({ success: false, message: "Not authorized" });
//     }

//     const { name, username, password, school_id } = req.body;
//     // const driver = await Driver.create({ name, username, password, school_id });
//     // res.json({ success: true, driver });
//     const driver = await Driver.create({ name, username, password, school_id });
// res.json({
//   success: true,
//   driver: {
//     id: driver.id,
//     name: driver.name,
//     username: driver.username,
//     school_id: driver.school_id
//   }
// });

//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Get login logs (Admin only)
// app.get("/api/drivers/:id/logins", authMiddleware, async (req, res) => {
//   try {
//     if (!["superadmin", "schooladmin"].includes(req.user.role)) {
//       return res.status(403).json({ success: false, message: "Not authorized" });
//     }

//     const logs = await DriverLoginLog.findAll({
//       where: { driver_id: req.params.id },
//       order: [["login_time", "DESC"]],
//       limit: 50
//     });

//     res.json({ success: true, data: logs });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });


// app.post("/api/drivers/login", async (req, res) => {
//   try {
//     const { username, password, device_id } = req.body;
//     const driver = await Driver.findOne({ where: { username } });

//     if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });

//     // const isMatch = await bcrypt.compare(password, driver.password);
//     const isMatch = (password === driver.password);
//     if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

//     //     if (!driver.device_id || driver.device_id !== device_id) {
//     //   driver.device_id = device_id;
//     //   await driver.save();
//     // }

//         driver.device_id = device_id;
//     await driver.save();


//     // Save login activity
//     // await PhoneActivity.create({
//     //   device_id: device_id || driver.device_id,
//     //   activity: "Driver Login",
//     //   DriverId: driver.id
//     // });
//     await DriverLoginLog.create({
//   driver_id: driver.id,
//   device_id,
//   status: "success"
// });


//     const token = jwt.sign(
//       { id: driver.id, role: "driver", school_id: driver.school_id },
//       JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({ success: true, token, driver: { id: driver.id, name: driver.name,username: driver.username,
//         school_id: driver.school_id,
//  device_id:driver.device_id } });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Create a new school
// app.post("/api/schools", authMiddleware, async (req, res) => {
//   try {
//     if (req.user.role !== "superadmin") {
//       return res.status(403).json({ success: false, message: "Only superadmin can create schools" });
//     }

//     const { name } = req.body;

//     const school = await School.create({ name });

//     res.json({ success: true, school });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });


// // 🔹 API: Manual cleanup of old logs
// app.delete("/api/activity/cleanup", async (req, res) => {
//   try {
//     const deleted = await PhoneActivity.destroy({
//       where: {
//         created_at: {
//           [Op.lt]: new Date(Date.now() - 24 * 60 * 60 * 1000) // older than 1 day
//         }
//       }
//     });
//     res.json({ success: true, message: `🧹 Deleted ${deleted} old logs` });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// app.post("/api/auth/register", async (req, res) => {
//   try {
//     const { username, password, role, school_id } = req.body;
//     const user = await User.create({ username, password, role, school_id });
//     res.json({ success: true, user });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // 🔹 Login
// app.post("/api/auth/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ where: { username } });

//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

// if (password !== user.password) {
//   return res.status(401).json({ success: false, message: "Invalid credentials" });
// }
// //     const isMatch = await bcrypt.compare(password, user.password);
// // if (!isMatch) {
// //   return res.status(401).json({ success: false, message: "Invalid credentials" });
// // }


//     const token = jwt.sign(
//       { id: user.id, role: user.role, school_id: user.school_id },
//       JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({ success: true, token, user: { id: user.id, username: user.username, role: user.role, school_id: user.school_id } });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// app.get("/api/activity", authMiddleware, async (req, res) => {
//   try {
//     let whereClause = {};

//     if (req.user.role !== "superadmin") {
//       // Only logs for that school
//       whereClause = { "$Driver.school_id$": req.user.school_id };
//     }

//     const logs = await PhoneActivity.findAll({
//       include: [{ model: Driver, attributes: ["name", "school_id"] }],
//       where: whereClause,
//       order: [["created_at", "DESC"]]
//     });

//     res.json({ success: true, data: logs });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // 🔹 Get all unassigned drivers (only superadmin should call this)
// // app.get("/api/drivers/unassigned", async (req, res) => {
// //   try {
// //     const drivers = await Driver.findAll({ where: { school_id: null } });
// //     res.json({ success: true, data: drivers });
// //   } catch (error) {
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // });

// app.put("/api/drivers/:id/assign", async (req, res) => {
//   try {
//     const { school_id } = req.body;
//     const driver = await Driver.findByPk(req.params.id);

//     if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });

//     driver.school_id = school_id;
//     await driver.save();

//     res.json({ success: true, data: driver });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });


// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });
// cron.schedule("0 0 * * *", async () => {
//   try {
//     const deleted = await PhoneActivity.destroy({
//       where: {
//         created_at: {
//           [Op.lt]: new Date(Date.now() - 24 * 60 * 60 * 1000) // older than 1 day
//         }
//       }
//     });
//     console.log(`🧹 Cleaned up ${deleted} old activity logs`);
//   } catch (err) {
//     console.error("Cleanup error:", err);
//   }
// });

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import PhoneActivity from "./models/PhoneActivity.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import { authMiddleware } from "./middleware/auth.js";
import Driver from "./models/Driver.js";
import School from "./models/School.js";
import DriverLoginLog from "./models/DriverLoginLog.js";
import driverRoutes from "./routes/driverRoutes.js";
import cron from "node-cron";

// ✅ Associations
Driver.hasMany(PhoneActivity, { foreignKey: "DriverId" });
PhoneActivity.belongsTo(Driver, { foreignKey: "DriverId" });
School.hasMany(Driver, { foreignKey: "school_id" });
Driver.belongsTo(School, { foreignKey: "school_id" });

// A School has many Users (schooladmins)
School.hasMany(User, { foreignKey: "school_id" });
User.belongsTo(School, { foreignKey: "school_id" });


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

app.use(cors());
app.use(express.json());
app.use("/api/drivers", driverRoutes);


// ✅ Test DB connection
sequelize.authenticate()
  .then(() => console.log("✅ MySQL connected successfully"))
  .catch(err => console.error("❌ DB Connection Error: ", err));
sequelize.sync({ alter: true })
  .then(() => console.log("✅ All models synchronized with DB"))
  .catch(err => console.error("❌ Error syncing models:", err));


   // SUPERADMIN: Create a school
app.post("/api/schools", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Only superadmin can create schools" });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "School name is required" });
    }

    const school = await School.create({ name });
    res.json({ success: true, school });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

   // SCHOOLADMIN / SUPERADMIN: Register a driver
app.post("/api/drivers/register", authMiddleware, async (req, res) => {
  try {
    if (!["superadmin", "schooladmin"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // const { name, username, password, school_id } = req.body;
    // if (!name || !username || !password || !school_id) {
    //   return res.status(400).json({ success: false, message: "All fields required" });
    // }

    // const driver = await Driver.create({ name, username, password, school_id });

    // res.json({
    //   success: true,
    //   driver: {
    //     id: driver.id,
    //     name: driver.name,
    //     username: driver.username,
    //     school_id: driver.school_id,
    //   },
    // });
    const { name, username, password } = req.body;
        let school_id = req.body.school_id;
if (req.user.role === "schooladmin") {
      school_id = req.user.school_id;
    }

if (!name || !username || !password || !school_id) {
  return res.status(400).json({ success: false, message: "All fields required" });
}

// ✅ Fetch school to attach its name to driver
const school = await School.findByPk(school_id);
if (!school) {
  return res.status(404).json({ success: false, message: "School not found" });
}

const existing = await Driver.findOne({ where: { username } });
    if (existing) {
      return res.status(400).json({ success: false, message: "Username already exists" });
    }


// ✅ Create driver with institute_name
const driver = await Driver.create({
  name,
  username,
  password,
  school_id,
  institute_name: school.name, // <--- This auto-fills the institute name
});

res.json({
  success: true,
  message: "Driver registered successfully",
  driver: {
    id: driver.id,
    name: driver.name,
    username: driver.username,
    school_id: driver.school_id,
    institute_name: driver.institute_name, // <--- Return to frontend too
  },
});

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

// if (password !== user.password) {
//   return res.status(401).json({ success: false, message: "Invalid credentials" });
// }
    const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
  return res.status(401).json({ success: false, message: "Invalid credentials" });
}

    const token = jwt.sign(
      { id: user.id, role: user.role, school_id: user.school_id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        school_id: user.school_id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});   

   // DRIVER: Login with username + password + device_id
app.post("/api/drivers/login", async (req, res) => {
  try {
    const { username, password, device_id } = req.body;
    const driver = await Driver.findOne({ where: { username } });

    if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    driver.device_id = device_id;
    await driver.save();

    await DriverLoginLog.create({
      driver_id: driver.id,
      device_id,
      status: "success",
    });

    const token = jwt.sign(
      { id: driver.id, role: "driver", school_id: driver.school_id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      driver: {
        id: driver.id,
        name: driver.name,
        username: driver.username,
        school_id: driver.school_id,
        device_id: driver.device_id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

   // DRIVER: Send phone activity (requires JWT driver role)
app.post("/api/activity", authMiddleware, async (req, res) => {
  try {
    console.log("🔍 req.user:", req.user);
console.log("🔍 req.body:", req.body);
console.log("🔍 Checking driver for ID:", req.user.id, "device:", req.body.device_id);

    if (req.user.role !== "driver") {
      return res.status(403).json({ success: false, message: "Only drivers can send activity" });
    }

    const { device_id, battery, screen_state, foreground_app, data_usage_mb } = req.body;
    if (!device_id) {
      return res.status(400).json({ success: false, message: "device_id is required" });
    }

    // const driver = await Driver.findOne({ where: { id: req.user.id, device_id } });
    const driver = await Driver.findOne({ where: { id: req.user.id } });
    if (!driver) {
      return res.status(401).json({ success: false, message: "Driver not logged in or device mismatch" });
    }

    const log = await PhoneActivity.create({
      device_id,
      battery,
      screen_state,
      foreground_app,
      data_usage_mb,
    institute_name: driver.institute_name, // ✅ store directly
      DriverId: driver.id,
    });

    res.json({ success: true, data: log });
  } catch (error) {
    console.error("Error saving activity:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// SUPERADMIN: Create a School Admin
app.post("/api/school-admins", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Only superadmin can create school admins" });
    }

    const { username, password, school_id } = req.body;

    if (!username || !password || !school_id) {
      return res.status(400).json({ success: false, message: "All fields (username, password, school_id) are required" });
    }

    // ✅ Check if school exists
    const school = await School.findByPk(school_id);
    if (!school) {
      return res.status(404).json({ success: false, message: "School not found" });
    }

    // ✅ Create school admin user
    const user = await User.create({
      username,
      password,   // Will be hashed automatically
      role: "schooladmin",
      school_id
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        school_id: user.school_id
      }
    });
  } catch (error) {
    console.error("Error creating school admin:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
// ✅ Fetch all schools (superadmin only for security, or remove authMiddleware if open)
app.get("/api/schools", authMiddleware, async (req, res) => {
  try {
    // Allow only superadmin to list schools
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Only superadmin can view schools" });
    }

    const schools = await School.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    res.json({ success: true, data: schools });
  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put("/api/schools/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "superadmin")
      return res.status(403).json({ success: false, message: "Only superadmin can update schools" });

    const { name, address } = req.body;
    const school = await School.findByPk(req.params.id);
    if (!school)
      return res.status(404).json({ success: false, message: "School not found" });

    school.name = name || school.name;
    school.address = address || school.address;
    await school.save();

    res.json({ success: true, data: school });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/api/schools/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "superadmin")
      return res.status(403).json({ success: false, message: "Only superadmin can delete schools" });

    const deleted = await School.destroy({ where: { id: req.params.id } });
    if (!deleted)
      return res.status(404).json({ success: false, message: "School not found" });

    res.json({ success: true, message: "School deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/school-admins", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "superadmin")
      return res.status(403).json({ success: false, message: "Only superadmin can view admins" });

    const admins = await User.findAll({
      where: { role: "schooladmin" },
      include: [{ model: School, attributes: ["id", "name"] }],
      attributes: ["id", "username", "role", "school_id", "createdAt"]
    });
    res.json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
app.put("/api/school-admins/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "superadmin")
      return res.status(403).json({ success: false, message: "Only superadmin can update admins" });

    const { username, password, school_id } = req.body;
    const admin = await User.findByPk(req.params.id);
    if (!admin)
      return res.status(404).json({ success: false, message: "Admin not found" });

    if (username) admin.username = username;
    if (password) admin.password = await bcrypt.hash(password, 10);
    if (school_id) admin.school_id = school_id;
    await admin.save();

    res.json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/api/school-admins/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "superadmin")
      return res.status(403).json({ success: false, message: "Only superadmin can delete admins" });

    const deleted = await User.destroy({ where: { id: req.params.id, role: "schooladmin" } });
    if (!deleted)
      return res.status(404).json({ success: false, message: "Admin not found" });

    res.json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
app.get("/api/drivers", authMiddleware, async (req, res) => {
  try {
    let where = {};
    if (req.user.role === "schooladmin") {
      where.school_id = req.user.school_id;
    } else if (req.query.school_id) {
      where.school_id = req.query.school_id;
    }

    const drivers = await Driver.findAll({
      where,
      include: [{ model: School, attributes: ["id", "name"] }],
      attributes: ["id", "name", "username", "school_id", "device_id", "createdAt"]
    });
    res.json({ success: true, data: drivers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/drivers/:id", authMiddleware, async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id, {
      include: [{ model: School, attributes: ["id", "name"] }]
    });

    if (!driver)
      return res.status(404).json({ success: false, message: "Driver not found" });

    if (req.user.role === "schooladmin" && driver.school_id !== req.user.school_id)
      return res.status(403).json({ success: false, message: "Access denied" });

    res.json({ success: true, data: driver });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/api/drivers/:id", authMiddleware, async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver)
      return res.status(404).json({ success: false, message: "Driver not found" });

    if (req.user.role === "schooladmin" && driver.school_id !== req.user.school_id)
      return res.status(403).json({ success: false, message: "Access denied" });

    await driver.destroy();
    res.json({ success: true, message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});



   // ADMIN: Fetch activity logs (scoped by role)
app.get("/api/activity", authMiddleware, async (req, res) => {
  try {
    let whereClause = {};

    if (req.user.role !== "superadmin") {
      // Only logs for the admin’s school
      whereClause = { "$Driver.school_id$": req.user.school_id };
    }

    const logs = await PhoneActivity.findAll({
      include: [{ model: Driver, attributes: ["name", "school_id"] }],
      where: whereClause,
      order: [["created_at", "DESC"]],
    });

    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

   // Cleanup old logs (daily cron)
cron.schedule("0 0 * * *", async () => {
  try {
    const deleted = await PhoneActivity.destroy({
      where: {
        created_at: {
          [Op.lt]: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });
    console.log(`🧹 Cleaned up ${deleted} old activity logs`);
  } catch (err) {
    console.error("Cleanup error:", err);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

