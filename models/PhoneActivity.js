import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
// import Driver from "./Driver.js";

const PhoneActivity = sequelize.define(
  "PhoneActivity",
  {
    device_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    battery: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    screen_state: {
      type: DataTypes.STRING(10), // "ON" or "OFF"
      allowNull: true,
    },
    foreground_app: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    data_usage_mb: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    DriverId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "drivers", // must match table/model name
      key: "id",
    },
  },
  },
  {
    tableName: "phone_activity",
    timestamps: false,
  }
);

Driver.hasMany(PhoneActivity, { foreignKey: "DriverId" });
PhoneActivity.belongsTo(Driver, { foreignKey: "DriverId" });

export default PhoneActivity;
