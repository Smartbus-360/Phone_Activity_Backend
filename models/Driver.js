// models/Driver.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import School from "./School.js";

const Driver = sequelize.define("Driver", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  device_id: { type: DataTypes.STRING, allowNull: false, unique: true }
}, {
  tableName: "drivers",
  timestamps: true
});

// 🔹 A driver belongs to a school
Driver.belongsTo(School, { foreignKey: "school_id" });
School.hasMany(Driver, { foreignKey: "school_id" });

export default Driver;
