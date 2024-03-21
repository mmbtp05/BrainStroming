const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const submissionForContest = sequelize.define('submissionForContest', {
  Submissionid: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
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
  solution: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  official: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue:0
  },
}, {
  // Other model options go here
  freezeTableName:'submissionForContest',
  timestamps: false
});

// console.log(Submission === sequelize.models.Submission); // true
module.exports=submissionForContest;