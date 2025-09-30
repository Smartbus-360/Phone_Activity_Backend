// // models/School.js
// import { DataTypes } from "sequelize";
// import sequelize from "../config/db.js";

// const School = sequelize.define("School", {
//   id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
//   name: { type: DataTypes.STRING, allowNull: false }
// }, {
//   tableName: "schools",
//   timestamps: true
// });

// export default School;

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const School = sequelize.define("School", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,            // ✅ prevent duplicate school names
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,         // optional
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,         // superadmin ID (from users table)
  }
}, {
  tableName: "schools",
  timestamps: true,          // keeps createdAt + updatedAt
});

export default School;
