const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Pk2submission = sequelize.define('Pk2submission', {
  Submissionid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pk2: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  }
}, {
  // Other model options go here
  freezeTableName:'Pk2submission',
  timestamps: false
});

// console.log(Pk2submission === sequelize.models.Pk2submission); // true
module.exports=Pk2submission;