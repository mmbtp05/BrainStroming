const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const SubmissionQueue = sequelize.define('SubmissionQueue', {
  problemId: {
    type: DataTypes.STRING,
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
}, {
  freezeTableName:'SubmissionQueue',
  timestamps: false
});

module.exports=SubmissionQueue;