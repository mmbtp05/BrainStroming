const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Pk3submission = sequelize.define('Pk3submission', {
  Submissionid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pk3: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  }
}, {
  // Other model options go here
  freezeTableName:'Pk3submission',
  timestamps: false
});

// console.log(Pk3submission === sequelize.models.Pk3submission); // true
module.exports=Pk3submission;