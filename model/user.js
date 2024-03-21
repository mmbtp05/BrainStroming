const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = sequelize.define('User', {
    userId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  emailid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password : {
    type: DataTypes.STRING,
    allowNull: false
  },
  totalsubmissions: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue:0
  },
  totalcontests: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue:0
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue:0
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue:"user"
  },
}, {
  freezeTableName:'User',
  timestamps: false
});

module.exports=User;