const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tabSchema = new Schema({
  name: String,
  status: String,
  serie: [{
    type: Schema.Types.ObjectId,
    ref:'serie'
  }]
}, { timestamps: true });

const Tab = mongoose.model('tab', tabSchema)
module.exports = Tab