const mongoose = require('mongoose');
const sollutionSchema = new mongoose.Schema({
  sollution:{ type: String},
});
const Sollution = mongoose.model('Sollution', sollutionSchema);
module.exports = Sollution;