const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Submission = sequelize.define('Submission', {
  // Model attributes are defined here
  // pk1: {
  //   type: DataTypes.STRING,
  //   primaryKey: true,
  //   allowNull: false
  // },
  Submissionid: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  when: {
    type: DataTypes.DATE,
    allowNull: false
  },
  who: {
    type: DataTypes.STRING,
    allowNull: false
  },
  problemId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  veridict: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  freezeTableName:'Submission',
  timestamps: false
});
module.exports=Submission;