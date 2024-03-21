const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const contestApplicants = sequelize.define('contestApplicants', {
  registerid: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
},{
  freezeTableName:'contestApplicants',
  timestamps: false
});

// console.log(TestCase === sequelize.models.TestCase); // true
module.exports=contestApplicants;