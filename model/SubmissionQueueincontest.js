const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const SubmissionQueueincontest = sequelize.define('SubmissionQueueincontest', {
    problemnum: {
    type: DataTypes.INTEGER,
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
  solution: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  freezeTableName:'SubmissionQueueincontest',
  timestamps: false
});

module.exports=SubmissionQueueincontest;