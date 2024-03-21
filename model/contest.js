const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Contests = sequelize.define('Contests', {
    contestidrank: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  userid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ratingChanges : {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  initialrating:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  freezeTableName:'Contests',
  timestamps: false
});

module.exports=Contests;