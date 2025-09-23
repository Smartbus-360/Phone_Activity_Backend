import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PhoneActivity = sequelize.define(
  "PhoneActivity",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
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
  },
  {
    tableName: "phone_activity",
    timestamps: false,
  }
);

export default PhoneActivity;
