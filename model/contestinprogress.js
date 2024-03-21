const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Contestinprogress = sequelize.define('Contestinprogress', {
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
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue:0
  },
  finalrating: {
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
  freezeTableName:'Contestinprogress',
  timestamps: false
});

module.exports=Contestinprogress;