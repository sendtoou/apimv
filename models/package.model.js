import mongoose from 'mongoose';
const Schema = mongoose.Schema

const packageSchema = new Schema({
  name: String,
  expireAmountDay: Number,
  member: {
    type: Schema.Types.ObjectId,
    ref:'user'
  }
});
const Package = mongoose.model('package', packageSchema)
module.exports = Package