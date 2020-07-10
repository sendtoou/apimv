// const mongoose = require('mongoose')
import mongoose from 'mongoose';
const bcrypt = require('bcryptjs')
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
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
  sessionToken: [{
    _id:false,
    refreshToken: { type: String, required: true },
    expireAt: { type: Number, required: true }
  }],
  packages: [{
    type: Schema.Types.ObjectId,
    ref:'package'
  }]
});


// module.exports = mongoose.model('user', new mongoose.Schema({
//   username: { type: String, required: true },
//   password: { type: String, required: true },
// },{ timestamps: true , versionKey: false }))

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  return _.omit(user, ['password', 'sessionToken']);
}

userSchema.pre('save', async function(next) {
  try{
    // if (this.method !== 'local') {
    //   next()
    // }
    let user = this
    if (user.isModified('password')) {
      const salt = await bcrypt.genSalt(10)
      const passwordHash = await bcrypt.hash(user.password, salt)
      user.password = passwordHash
      next()
    }
  }catch(e){
    next(e)
  }
})

userSchema.methods.isValidPassword = async function(newPassword) {
  try{
      // return await bcrypt.compare(newPassword, this.local.password)
      return await bcrypt.compare(newPassword, this.password)
  }catch(e) {
      throw new Error(e)
  }
}

userSchema.methods.genAccessToken = async function() {
  try {
    const user = this
    const accessToken = await jwt.sign({ uid: user._id.toHexString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '10s' });
    return accessToken
  }catch(e) {
    throw new Error(e)
  }
}

userSchema.methods.genRefreshToken = async function() {
  try {
    return await crypto.randomBytes(64).toString("hex");
  }catch(e) {
    throw new Error(e)
  }
}

userSchema.statics.hasRefreshTokenExpired = (expireAt) => {
  let secondsSinceEpoch = Date.now() / 1000;
    if (expireAt > secondsSinceEpoch) {
        // hasn't expired
        return false;
    } else {
        // has expired
        return true;
    }
}

let genRefreshTokenExpiryTime = () => {
  // let daysUntilExpire = "1";
  // let secondsUntilExpire = ((daysUntilExpire * 24) * 60) * 60;
  // return ((Date.now() / 1000) + secondsUntilExpire);
 
  let secondsUntilExpire = 50 // 50 second
  return ((Date.now() / 1000) + secondsUntilExpire);
}

let saveSessionToken = async(user, refreshToken) => {
  try {
    let expireAt = genRefreshTokenExpiryTime();
    user.sessionToken.push({'refreshToken': refreshToken, expireAt})
    await user.save()
    return refreshToken
  }catch(e) {
    throw new Error(e)
  }
}

userSchema.methods.createSessionToken = async function() {
  try {
    let user = this
    const refreshToken = await user.genRefreshToken()
    await saveSessionToken(user, refreshToken)
    return refreshToken
  }catch(e) {
    throw new Error(e)
  }
}

userSchema.statics.findByIdAndToken = async function(_id, refreshToken) {
    try {
      const user = await User.findOne({ _id, 'sessionToken.refreshToken': refreshToken})
      return user
    }catch(e) {
      throw new Error(e)
    }
}

userSchema.statics.findByCredentials = async function (email, password) {
  try {
    const user = await User.findOne({ email })
    if (!user) {
      throw new Error({ message: 'credentials not found' })
      // throw new Error(`No user found for email: ${email}`)
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new Error({ message: 'credentials not match' })
    }
    return user
  }catch(e) {
    throw new Error(e)
  }
}

const User = mongoose.model('user', userSchema);
module.exports = User