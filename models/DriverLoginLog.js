// models/DriverLoginLog.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Driver from "./Driver.js";

const DriverLoginLog = sequelize.define("DriverLoginLog", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  login_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  device_id: { type: DataTypes.STRING, allowNull: true },
  status: { type: DataTypes.STRING, defaultValue: "success" } // success / failed
}, {
  tableName: "driver_login_logs",
  timestamps: false
});

// Relationships
DriverLoginLog.belongsTo(Driver, { foreignKey: "driver_id" });
Driver.hasMany(DriverLoginLog, { foreignKey: "driver_id" });

export default DriverLoginLog;
