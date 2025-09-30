// models/Driver.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import School from "./School.js";
// import PhoneActivity from "./PhoneActivity.js";
import bcrypt from "bcrypt";   



const Driver = sequelize.define("Driver", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },  // NEW
  password: { type: DataTypes.STRING, allowNull: false },
  device_id: { type: DataTypes.STRING, allowNull: false, unique: true },
  school_id: { type: DataTypes.INTEGER, allowNull: true }
}, {
  tableName: "drivers",
  timestamps: true
});

Driver.beforeCreate(async (driver) => {
  driver.password = await bcrypt.hash(driver.password, 10);
});

// 🔹 A driver belongs to a school
Driver.belongsTo(School, { foreignKey: "school_id" });
School.hasMany(Driver, { foreignKey: "school_id" });
Driver.hasMany(PhoneActivity, { foreignKey: "DriverId" });
PhoneActivity.belongsTo(Driver, { foreignKey: "DriverId" });

export default Driver;
