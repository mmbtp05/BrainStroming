const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const TestCase = sequelize.define('TestCase', {
  testid: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  input: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  output: {
    type: DataTypes.TEXT,
    allowNull: false
  },
}, {
  freezeTableName:'TestCase',
  timestamps: false
});

// console.log(TestCase === sequelize.models.TestCase); // true
module.exports=TestCase;