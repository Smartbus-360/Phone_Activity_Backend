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
    activity: {
      type: DataTypes.TEXT,
      allowNull: true, // आपकी table में nullable है
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
