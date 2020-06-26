const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema

const userSchema = new Schema({
  // method: { 
  //   type: String, 
  //   enum: ['local', 'google', 'facebook'], 
  //   // required: true 
  // },
  // local: {
  //   email: { type: String, lowercase: true },
  //   password: { type: String }
  // },
  // google:{
  //   id: { type: String },
  //   email: { type: String, lowercase: true }
  // },
  // facebook: {
  //   id: { type: String },
  //   email: { type: String, lowercase: true }
  // },
  email: { type: String, lowercase: true },
  password: { type: String },
  role: {
    type: [String],
    enum: ['admin', 'manager', 'user', 'member']
  },
  packages: [{
    type: Schema.Types.ObjectId,
    ref:'package'
  }]
});

// userSchema.pre('save', async function(next) {
//   try{
//     // if (this.method !== 'local') {
//     //   next()
//     // }
//       const salt = await bcrypt.genSalt(10)
//       // const passwordHash = await bcrypt.hash(this.local.password, salt)
//       const passwordHash = await bcrypt.hash(this.password, salt)
//       // this.local.password = passwordHash
//       this.password = passwordHash
//       next()
//   }catch(error){
//       next(error)
//   }
// })

userSchema.methods.isValidPassword = async function(newPassword) {
  try{
      // return await bcrypt.compare(newPassword, this.local.password)
      return await bcrypt.compare(newPassword, this.password)
  }catch(error) {
      throw new Error(error)
  }
}

const User = mongoose.model('user', userSchema)
module.exports = User
