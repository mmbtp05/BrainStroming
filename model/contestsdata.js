const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Contestsdata = sequelize.define('Contestsdata',{
  contestId:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement:true
  },
  contestName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // numberOfQuestions: {
  //   type: DataTypes.INTEGER,
  //   allowNull: true,
  //   defaultValue:0
  // },
  numberOfParticipants: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue:0
  },
  actualNumberOfParticipants: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue:0
  },
  startDate :{
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate:{
    type: DataTypes.DATE,
    allowNull: false
  },
}, {
  freezeTableName:'Contestsdata',
  timestamps: false
});

module.exports=Contestsdata;