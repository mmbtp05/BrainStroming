const mongoose = require('mongoose');
const testCaseSchema = new mongoose.Schema({
  input:{ type: String,required :true},
  output:{ type: String,required :true}
});
const testCase = mongoose.model('testCase', testCaseSchema);
module.exports = testCase;