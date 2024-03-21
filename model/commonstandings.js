const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const commonstandings = sequelize.define('commonstandings', {
    contestIdandRank: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue:0
  },
  A:{
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue:0
  },
  B:{
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue:0
  },
  C:{
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue:0
  },
  D:{
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue:0
  },
}
,{
  freezeTableName:'commonstandings',
  timestamps: false
});

module.exports=commonstandings;