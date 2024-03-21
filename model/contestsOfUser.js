const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const ContestsOfUser = sequelize.define('ContestsOfUser', {
    useridContestNumberOfUser: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  contestid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Rank :{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  initialrating :{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  finalrating :{
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  freezeTableName:'ContestsOfUser',
  timestamps: false
});

module.exports=ContestsOfUser;