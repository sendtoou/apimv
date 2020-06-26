const mongoose = require('mongoose')
const Schema = mongoose.Schema

const packageSchema = new Schema({
  name: String,
  expireAmountDay: Number,
  member: {
    type: Schema.Types.ObjectId,
    ref:'user'
  }
});
const package = mongoose.model('package', packageSchema)
module.exports = package