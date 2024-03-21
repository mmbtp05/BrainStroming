const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Pk1submission = sequelize.define('Pk1submission', {
  Submissionid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pk1: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  }
}, {
  freezeTableName:'Pk1submission',
  timestamps: false
});

// console.log(Pk1submission === sequelize.models.Pk1submission); // true
module.exports=Pk1submission;