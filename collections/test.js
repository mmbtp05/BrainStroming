const mongoose = require('mongoose');
const testCase = require('./testCase');
const testSchema = new mongoose.Schema({
  testCasesId:[{ type: mongoose.Schema.Types.ObjectId, ref: testCase}]
});
const test = mongoose.model('test', testSchema);
module.exports = test;