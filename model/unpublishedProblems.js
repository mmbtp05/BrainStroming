const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const unpublishedProblem = sequelize.define('unpublishedProblem', {
  problemName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  problemid: {
    type: DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement: true
  },
  contestid: {
    type: DataTypes.STRING(),
    allowNull: true,
    defaultValue:null
  },
  problemnum: {
    type: DataTypes.INTEGER(),
    allowNull: true,
    defaultValue:null
  },
  problemStatement: {
    type: DataTypes.TEXT(),
    allowNull: false
  },
  problemInput: {
    type: DataTypes.TEXT(),
    allowNull: false
  },
  problemOutput: {
    type: DataTypes.TEXT(),
    allowNull: false
  },
  problemNote: {
    type: DataTypes.TEXT(),
    defaultValue:null,
    allowNull: true
  },
  timeLimit: {
    type: DataTypes.INTEGER(),
    allowNull: false
  },
  memoryLimit: {
    type: DataTypes.INTEGER(),
    allowNull: false
  },
  testCases: {
    type: DataTypes.STRING(),
    allowNull: false,
  },
  solution: {
    type: DataTypes.STRING(),
    allowNull: false,
  },
  difficulty: {
    type: DataTypes.INTEGER(),
    allowNull: false
  },
  tags: {
    type: DataTypes.STRING(),
    allowNull: true,
    defaultValue:null,
  },
  sampleInput: {
    type: DataTypes.TEXT(),
    allowNull: false,
  },
  sampleOutput: {
    type: DataTypes.TEXT(),
    allowNull: false,
  },
}, {
  freezeTableName:'unpublishedProblem',
  timestamps: false
});

module.exports=unpublishedProblem;