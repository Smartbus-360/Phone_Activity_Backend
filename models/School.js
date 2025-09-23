// models/School.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const School = sequelize.define("School", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: "schools",
  timestamps: true
});

export default School;
