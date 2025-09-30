// models/User.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import bcrypt from "bcrypt";

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("superadmin", "schooladmin"), defaultValue: "schooladmin" },
  school_id: { type: DataTypes.INTEGER, allowNull: true,
               references: {
    model: "schools",
    key: "id"
  },
  onDelete: "SET NULL",
  onUpdate: "CASCADE"}
}, {
  tableName: "users",
  timestamps: true
});

// 🔹 Hash password before saving
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

export default User;
