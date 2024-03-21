const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Problem = sequelize.define('Problem', {
  problemName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  problemid: {
    type: DataTypes.STRING(100),
    primaryKey:true,
    allowNull:false
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
  attempts: {
    type: DataTypes.INTEGER(),
    defaultValue:0,
    allowNull: true
  }
}, {
  freezeTableName:'Problem',
  timestamps: false
});

module.exports=Problem;